// /home/lixin/work/study_work/vue_pro/frontend/mock/server.js

/**
 * Mock Server for Development
 * 模拟后端 API 服务器
 */

import { mockSettings, mockProducts, mockInquiries, mockOrders, mockAdmins } from './data.js'

// 内存中的数据副本（支持修改）
let settingsData = { ...mockSettings }
let productsData = [...mockProducts]
let inquiriesData = [...mockInquiries]
let ordersData = [...mockOrders]

// 生成 CORS 头
function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  }
}

// 处理预检请求
function handleCors(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders(req.headers.origin))
    res.end()
    return true
  }
  return false
}

// 解析请求体
async function parseBody(req) {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (e) {
        resolve({})
      }
    })
  })
}

// 发送 JSON 响应
function sendJson(res, statusCode, data, headers = {}) {
  res.writeHead(statusCode, { ...corsHeaders(headers.origin), ...headers })
  res.end(JSON.stringify(data))
}

// 验证管理员权限
function verifyAdmin(req) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    return decoded
  } catch (e) {
    return null
  }
}

// 验证超级管理员
function verifySuperAdmin(req) {
  const admin = verifyAdmin(req)
  if (!admin || admin.role !== 'super_admin') {
    return null
  }
  return admin
}

// Mock API 路由处理器
export async function mockApiHandler(req, res, url) {
  // 处理 CORS
  if (handleCors(req, res)) return

  const pathname = url.pathname
  const method = req.method

  // ===== Settings API =====
  if (pathname === '/api/settings') {
    if (method === 'GET') {
      return sendJson(res, 200, { success: true, data: settingsData })
    }

    if (method === 'POST') {
      const admin = verifySuperAdmin(req)
      if (!admin) {
        return sendJson(res, 403, { error: 'Unauthorized. Super admin access required.' })
      }

      const data = await parseBody(req)
      settingsData = {
        ...settingsData,
        ...data,
        updated_at: new Date().toISOString()
      }
      return sendJson(res, 200, { success: true, message: 'Settings saved successfully', data: settingsData })
    }
  }

  // ===== Products API =====
  if (pathname === '/api/products' || pathname.startsWith('/api/products/')) {
    const parts = pathname.split('/').filter(Boolean)

    // GET /api/products - 获取所有产品
    if (method === 'GET' && parts.length === 2) {
      const admin = verifyAdmin(req)
      const products = admin ? productsData : productsData.filter(p => p.is_active === 1)
      return sendJson(res, 200, { success: true, data: products })
    }

    // GET /api/products/featured - 获取精选产品
    if (method === 'GET' && parts[2] === 'featured') {
      const featured = productsData.filter(p => p.is_featured === 1 && p.is_active === 1).slice(0, 8)
      return sendJson(res, 200, { success: true, data: featured })
    }

    // GET /api/products/:id - 获取单个产品
    if (method === 'GET' && parts.length === 3) {
      const productId = parseInt(parts[2])
      const admin = verifyAdmin(req)
      const product = productsData.find(p => p.id === productId)

      if (!product || (!admin && product.is_active !== 1)) {
        return sendJson(res, 404, { error: 'Product not found' })
      }

      return sendJson(res, 200, { success: true, data: product })
    }

    // POST /api/products - 创建产品
    if (method === 'POST' && parts.length === 2) {
      const admin = verifySuperAdmin(req)
      if (!admin) {
        return sendJson(res, 403, { error: 'Unauthorized. Super admin access required.' })
      }

      const data = await parseBody(req)
      const newProduct = {
        id: Math.max(...productsData.map(p => p.id)) + 1,
        ...data,
        is_featured: data.is_featured ? 1 : 0,
        is_active: data.is_active !== undefined ? data.is_active : 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      productsData.push(newProduct)
      return sendJson(res, 201, { success: true, data: { id: newProduct.id } })
    }

    // PUT /api/products/:id - 更新产品
    if (method === 'PUT' && parts.length === 3) {
      const admin = verifySuperAdmin(req)
      if (!admin) {
        return sendJson(res, 403, { error: 'Unauthorized. Super admin access required.' })
      }

      const productId = parseInt(parts[2])
      const data = await parseBody(req)
      const index = productsData.findIndex(p => p.id === productId)

      if (index === -1) {
        return sendJson(res, 404, { error: 'Product not found' })
      }

      productsData[index] = {
        ...productsData[index],
        ...data,
        updated_at: new Date().toISOString()
      }

      return sendJson(res, 200, { success: true })
    }

    // DELETE /api/products/:id - 删除产品（软删除）
    if (method === 'DELETE' && parts.length === 3) {
      const admin = verifySuperAdmin(req)
      if (!admin) {
        return sendJson(res, 403, { error: 'Unauthorized. Super admin access required.' })
      }

      const productId = parseInt(parts[2])
      const index = productsData.findIndex(p => p.id === productId)

      if (index === -1) {
        return sendJson(res, 404, { error: 'Product not found' })
      }

      productsData[index].is_active = 0
      productsData[index].updated_at = new Date().toISOString()

      return sendJson(res, 200, { success: true })
    }
  }

  // ===== Inquiries API =====
  if (pathname === '/api/inquiries' || pathname.startsWith('/api/inquiries/')) {
    const parts = pathname.split('/').filter(Boolean)

    // GET /api/inquiries - 获取所有询盘
    if (method === 'GET' && parts.length === 2) {
      const admin = verifyAdmin(req)
      if (!admin) {
        return sendJson(res, 403, { error: 'Unauthorized' })
      }
      return sendJson(res, 200, { success: true, data: inquiriesData })
    }

    // POST /api/inquiries - 创建询盘
    if (method === 'POST' && parts.length === 2) {
      const data = await parseBody(req)
      const newInquiry = {
        id: Math.max(...inquiriesData.map(i => i.id)) + 1,
        ...data,
        status: 'new',
        created_at: new Date().toISOString()
      }

      inquiriesData.push(newInquiry)
      return sendJson(res, 201, { success: true, data: { id: newInquiry.id } })
    }

    // PUT /api/inquiries/:id - 更新询盘状态
    if (method === 'PUT' && parts.length === 3) {
      const admin = verifyAdmin(req)
      if (!admin) {
        return sendJson(res, 403, { error: 'Unauthorized' })
      }

      const inquiryId = parseInt(parts[2])
      const data = await parseBody(req)
      const index = inquiriesData.findIndex(i => i.id === inquiryId)

      if (index === -1) {
        return sendJson(res, 404, { error: 'Inquiry not found' })
      }

      inquiriesData[index] = {
        ...inquiriesData[index],
        ...data
      }

      return sendJson(res, 200, { success: true })
    }
  }

  // ===== Payment Orders API =====
  if (pathname === '/api/payment/orders' || pathname.startsWith('/api/payment/orders/')) {
    const parts = pathname.split('/').filter(Boolean)

    // GET /api/payment/orders - 获取所有订单
    if (method === 'GET' && parts.length === 3) {
      const admin = verifyAdmin(req)
      if (!admin) {
        return sendJson(res, 403, { error: 'Unauthorized' })
      }
      return sendJson(res, 200, { success: true, data: ordersData })
    }

    // GET /api/payment/orders/:id - 获取单个订单
    if (method === 'GET' && parts.length === 4) {
      const orderId = parts[3]
      const order = ordersData.find(o => o.id === orderId || o.order_number === orderId)

      if (!order) {
        return sendJson(res, 404, { error: 'Order not found' })
      }

      return sendJson(res, 200, { success: true, data: order })
    }
  }

  // ===== Admin Login API =====
  if (pathname === '/api/admin/login' && method === 'POST') {
    const data = await parseBody(req)
    const admin = mockAdmins.find(a => 
      a.username === data.username && a.password === data.password
    )
    
    if (!admin) {
      return sendJson(res, 401, { error: 'Invalid credentials' })
    }
    
    const token = Buffer.from(JSON.stringify({
      username: admin.username,
      role: admin.role,
      timestamp: Date.now()
    })).toString('base64')
    
    return sendJson(res, 200, {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: 1,
        username: admin.username,
        email: 'admin@example.com',
        role: admin.role
      }
    })
  }

  // ===== Admin Verify API =====
  if (pathname === '/api/admin/verify' && method === 'GET') {
    const admin = verifyAdmin(req)
    if (!admin) {
      return sendJson(res, 401, { error: 'Unauthorized' })
    }

    return sendJson(res, 200, {
      success: true,
      admin: { username: admin.username, role: admin.role }
    })
  }

  // ===== Upload API =====
  if (pathname === '/api/upload/image' && method === 'POST') {
    const admin = verifyAdmin(req)
    if (!admin) {
      return sendJson(res, 403, { error: 'Unauthorized' })
    }

    // 模拟上传，返回占位图 URL
    return sendJson(res, 200, {
      success: true,
      url: `https://via.placeholder.com/600x400?text=Uploaded+Image+${Date.now()}`
    })
  }

  // 未匹配的路由
  return sendJson(res, 404, { error: 'API endpoint not found' })
}

export default mockApiHandler
