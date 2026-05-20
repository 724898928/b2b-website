/**
 * Payment API Handler
 * Handles WeChat Pay, Alipay, and PayPal payment processing
 */

import { requireAuth } from './admin';

export async function handlePayment(request, env, corsHeaders) {
  const url = new URL(request.url);
  const method = request.method;
  const pathParts = url.pathname.split('/').filter(Boolean);

  // POST /api/payment/wechat/create - Create WeChat Pay order
  if (method === 'POST' && pathParts[2] === 'wechat' && pathParts[3] === 'create') {
    return createWeChatPayOrder(request, env, corsHeaders);
  }

  // POST /api/payment/wechat/notify - WeChat Pay callback
  if (method === 'POST' && pathParts[2] === 'wechat' && pathParts[3] === 'notify') {
    return handleWeChatPayNotify(request, env, corsHeaders);
  }

  // POST /api/payment/alipay/create - Create Alipay order
  if (method === 'POST' && pathParts[2] === 'alipay' && pathParts[3] === 'create') {
    return createAlipayOrder(request, env, corsHeaders);
  }

  // POST /api/payment/alipay/notify - Alipay callback
  if (method === 'POST' && pathParts[2] === 'alipay' && pathParts[3] === 'notify') {
    return handleAlipayNotify(request, env, corsHeaders);
  }

  // POST /api/payment/paypal/create - Create PayPal order
  if (method === 'POST' && pathParts[2] === 'paypal' && pathParts[3] === 'create') {
    return createPayPalOrder(request, env, corsHeaders);
  }

  // POST /api/payment/paypal/capture - Capture PayPal payment
  if (method === 'POST' && pathParts[2] === 'paypal' && pathParts[3] === 'capture') {
    return capturePayPalPayment(request, env, corsHeaders);
  }

  // GET /api/payment/orders - Get payment orders (Admin only)
  if (method === 'GET' && pathParts[2] === 'orders') {
    return getPaymentOrders(request, env, corsHeaders);
  }

  // GET /api/payment/orders/:id - Get single payment order
  if (method === 'GET' && pathParts.length === 4) {
    const orderId = pathParts[3];
    return getPaymentOrder(env, orderId, corsHeaders);
  }

  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Create WeChat Pay Order
async function createWeChatPayOrder(request, env, corsHeaders) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.out_trade_no || !data.total_fee || !data.body) {
      return new Response(JSON.stringify({
        error: 'out_trade_no, total_fee, and body are required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // TODO: Integrate with WeChat Pay API
    // This is a placeholder implementation
    const orderData = {
      out_trade_no: data.out_trade_no,
      total_fee: data.total_fee, // Amount in cents
      body: data.body,
      notify_url: data.notify_url || `${new URL(request.url).origin}/api/payment/wechat/notify`,
      trade_type: data.trade_type || 'NATIVE', // NATIVE, JSAPI, APP, etc.
      status: 'pending',
      created_at: new Date().toISOString()
    };

    // Save order to database
    await env.DB.prepare(
      `INSERT INTO payment_orders 
       (order_no, payment_method, amount, currency, description, status, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      orderData.out_trade_no,
      'wechat',
      orderData.total_fee,
      'CNY',
      orderData.body,
      orderData.status,
      JSON.stringify(orderData)
    ).run();

    // Return mock QR code for NATIVE payment
    // In production, call WeChat Pay API to get real code_url
    return new Response(JSON.stringify({
      success: true,
      data: {
        order_no: orderData.out_trade_no,
        code_url: 'weixin://wxpay/bizpayurl?pr=xxxxx', // Mock QR code
        expires_in: 7200 // 2 hours
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('WeChat Pay error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Handle WeChat Pay Notify
async function handleWeChatPayNotify(request, env, corsHeaders) {
  try {
    // WeChat Pay sends XML format, but we'll handle JSON for simplicity
    const data = await request.json();
    
    // Verify signature (implement based on WeChat Pay docs)
    // const isValid = verifyWeChatSignature(data);
    
    if (data.return_code === 'SUCCESS' && data.result_code === 'SUCCESS') {
      // Update order status
      await env.DB.prepare(
        'UPDATE payment_orders SET status = ?, paid_at = CURRENT_TIMESTAMP, transaction_id = ? WHERE order_no = ?'
      ).bind(
        'completed',
        data.transaction_id,
        data.out_trade_no
      ).run();

      return new Response('<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>', {
        headers: { ...corsHeaders, 'Content-Type': 'application/xml' },
      });
    }

    return new Response('<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[Failed]]></return_msg></xml>', {
      headers: { ...corsHeaders, 'Content-Type': 'application/xml' },
    });
  } catch (error) {
    console.error('WeChat Pay notify error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Create Alipay Order
async function createAlipayOrder(request, env, corsHeaders) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.out_trade_no || !data.total_amount || !data.subject) {
      return new Response(JSON.stringify({
        error: 'out_trade_no, total_amount, and subject are required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const orderData = {
      out_trade_no: data.out_trade_no,
      total_amount: data.total_amount,
      subject: data.subject,
      notify_url: data.notify_url || `${new URL(request.url).origin}/api/payment/alipay/notify`,
      return_url: data.return_url,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    // Save order to database
    await env.DB.prepare(
      `INSERT INTO payment_orders 
       (order_no, payment_method, amount, currency, description, status, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      orderData.out_trade_no,
      'alipay',
      orderData.total_amount,
      'CNY',
      orderData.subject,
      orderData.status,
      JSON.stringify(orderData)
    ).run();

    // TODO: Integrate with Alipay API
    // Return form or QR code for payment
    return new Response(JSON.stringify({
      success: true,
      data: {
        order_no: orderData.out_trade_no,
        qr_code: 'https://qr.alipay.com/xxxxx', // Mock QR code
        form: '<form>...</form>', // HTML form for redirect
        expires_in: 900 // 15 minutes
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Alipay error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Handle Alipay Notify
async function handleAlipayNotify(request, env, corsHeaders) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    
    // Verify signature (implement based on Alipay docs)
    // const isValid = verifyAlipaySignature(data);
    
    if (data.trade_status === 'TRADE_SUCCESS' || data.trade_status === 'TRADE_FINISHED') {
      // Update order status
      await env.DB.prepare(
        'UPDATE payment_orders SET status = ?, paid_at = CURRENT_TIMESTAMP, transaction_id = ? WHERE order_no = ?'
      ).bind(
        'completed',
        data.trade_no,
        data.out_trade_no
      ).run();

      return new Response('success', {
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
      });
    }

    return new Response('fail', {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    console.error('Alipay notify error:', error);
    return new Response('fail', {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    });
  }
}

// Create PayPal Order
async function createPayPalOrder(request, env, corsHeaders) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.amount || !data.currency || !data.description) {
      return new Response(JSON.stringify({
        error: 'amount, currency, and description are required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const orderNo = `PP${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    const orderData = {
      order_no: orderNo,
      amount: data.amount,
      currency: data.currency || 'USD',
      description: data.description,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    // Save order to database
    await env.DB.prepare(
      `INSERT INTO payment_orders 
       (order_no, payment_method, amount, currency, description, status, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      orderData.order_no,
      'paypal',
      orderData.amount,
      orderData.currency,
      orderData.description,
      orderData.status,
      JSON.stringify(orderData)
    ).run();

    // TODO: Integrate with PayPal API v2
    // In production, call PayPal Orders API
    return new Response(JSON.stringify({
      success: true,
      data: {
        order_no: orderData.order_no,
        paypal_order_id: 'ORDER_ID_FROM_PAYPAL', // Mock
        approve_url: 'https://www.paypal.com/checkoutnow?token=xxxxx', // Mock
        expires_in: 10800 // 3 hours
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('PayPal error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Capture PayPal Payment
async function capturePayPalPayment(request, env, corsHeaders) {
  try {
    const data = await request.json();
    
    if (!data.order_no || !data.paypal_order_id) {
      return new Response(JSON.stringify({
        error: 'order_no and paypal_order_id are required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // TODO: Call PayPal API to capture payment
    // In production, use PayPal Orders API to capture
    
    // Update order status
    await env.DB.prepare(
      'UPDATE payment_orders SET status = ?, paid_at = CURRENT_TIMESTAMP, transaction_id = ? WHERE order_no = ?'
    ).bind(
      'completed',
      data.paypal_order_id,
      data.order_no
    ).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Payment captured successfully',
      data: {
        order_no: data.order_no,
        status: 'completed'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('PayPal capture error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Get Payment Orders (Admin only)
async function getPaymentOrders(request, env, corsHeaders) {
  try {
    // Check authentication
    const admin = await requireAuth(request, env);
    if (!admin) {
      return new Response(JSON.stringify({
        error: 'Unauthorized'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 20;
    const offset = (page - 1) * limit;

    const { results } = await env.DB.prepare(
      'SELECT * FROM payment_orders ORDER BY created_at DESC LIMIT ? OFFSET ?'
    ).bind(limit, offset).all();

    const { count } = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM payment_orders'
    ).first();

    return new Response(JSON.stringify({
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Get payment orders error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Get Single Payment Order
async function getPaymentOrder(env, orderId, corsHeaders) {
  try {
    const order = await env.DB.prepare(
      'SELECT * FROM payment_orders WHERE order_no = ?'
    ).bind(orderId).first();

    if (!order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: order
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Get payment order error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
