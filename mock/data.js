/**
 * Mock Data for Development
 * 提供开发环境所需的模拟数据
 */

export const mockSettings = {
  site_name: 'GlobalMart',
  site_description: 'Your trusted partner for high-quality industrial products and innovative solutions worldwide',
  company_intro: 'We are a leading manufacturer and supplier of high-quality industrial products. With over 20 years of experience, we serve clients across the globe with innovative solutions and exceptional customer service.',
  email: '724898928li@gmail.com',
  phone: '+86 18717376759',
  address: '123 Business St, City, Country',
  linkedin: '',
  facebook: '',
  twitter: '',
}

export const mockProducts = [
  {
    id: 1,
    name: 'Industrial Motor X-2000',
    description: 'High-performance industrial motor with advanced efficiency',
    detailed_description: 'The X-2000 series represents the pinnacle of industrial motor technology. Featuring advanced magnetic materials and precision engineering, this motor delivers exceptional performance in demanding applications.',
    specifications: JSON.stringify({
      power: '50kW',
      voltage: '380V',
      rpm: '1500',
      efficiency: 'IE3 Premium',
      weight: '250kg'
    }),
    image_url: 'https://via.placeholder.com/600x400?text=Motor+X-2000',
    gallery_images: JSON.stringify([
      'https://via.placeholder.com/600x400?text=Motor+X-2000+View+1',
      'https://via.placeholder.com/600x400?text=Motor+X-2000+View+2',
      'https://via.placeholder.com/600x400?text=Motor+X-2000+View+3'
    ]),
    category: 'Motors',
    is_featured: 1,
    is_active: 1,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'Hydraulic Pump HP-500',
    description: 'Reliable hydraulic pump for heavy-duty applications',
    detailed_description: 'The HP-500 hydraulic pump is designed for continuous operation in the most demanding industrial environments. Its robust construction ensures long-lasting performance.',
    specifications: JSON.stringify({
      flow_rate: '500 L/min',
      pressure: '350 bar',
      displacement: '100 cm³/rev',
      speed: '1800 rpm',
      weight: '180kg'
    }),
    image_url: 'https://via.placeholder.com/600x400?text=Pump+HP-500',
    gallery_images: JSON.stringify([
      'https://via.placeholder.com/600x400?text=Pump+HP-500+View+1',
      'https://via.placeholder.com/600x400?text=Pump+HP-500+View+2'
    ]),
    category: 'Pumps',
    is_featured: 1,
    is_active: 1,
    created_at: '2024-01-20T14:30:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  },
  {
    id: 3,
    name: 'Control Panel CP-100',
    description: 'Advanced control panel with touchscreen interface',
    detailed_description: 'The CP-100 control panel features a modern touchscreen interface and powerful processing capabilities. Perfect for automation and monitoring applications.',
    specifications: JSON.stringify({
      display: '10" Touchscreen',
      processor: 'ARM Cortex-A9',
      memory: '2GB RAM',
      storage: '16GB Flash',
      connectivity: 'Ethernet, WiFi, Bluetooth'
    }),
    image_url: 'https://via.placeholder.com/600x400?text=Panel+CP-100',
    gallery_images: JSON.stringify([
      'https://via.placeholder.com/600x400?text=Panel+CP-100+View+1'
    ]),
    category: 'Control Systems',
    is_featured: 1,
    is_active: 1,
    created_at: '2024-02-01T09:15:00Z',
    updated_at: '2024-02-01T09:15:00Z'
  },
  {
    id: 4,
    name: 'Conveyor Belt System CB-3000',
    description: 'Modular conveyor system for efficient material handling',
    detailed_description: 'The CB-3000 conveyor belt system offers modular design for flexible configuration. Ideal for manufacturing, warehousing, and distribution centers.',
    specifications: JSON.stringify({
      length: 'Customizable up to 100m',
      width: '600mm - 1200mm',
      capacity: '3000 kg/h',
      speed: 'Variable 0.5-2 m/s',
      material: 'Heavy-duty steel frame'
    }),
    image_url: 'https://via.placeholder.com/600x400?text=Conveyor+CB-3000',
    gallery_images: JSON.stringify([
      'https://via.placeholder.com/600x400?text=Conveyor+CB-3000+View+1',
      'https://via.placeholder.com/600x400?text=Conveyor+CB-3000+View+2'
    ]),
    category: 'Material Handling',
    is_featured: 0,
    is_active: 1,
    created_at: '2024-02-10T11:45:00Z',
    updated_at: '2024-02-10T11:45:00Z'
  },
  {
    id: 5,
    name: 'Precision Gearbox GB-750',
    description: 'High-precision gearbox for accurate motion control',
    detailed_description: 'The GB-750 gearbox provides exceptional precision and reliability for motion control applications. Features low backlash and high torque capacity.',
    specifications: JSON.stringify({
      ratio: '10:1',
      torque: '750 Nm',
      backlash: '< 5 arcmin',
      efficiency: '95%',
      mounting: 'Flange mount'
    }),
    image_url: 'https://via.placeholder.com/600x400?text=Gearbox+GB-750',
    gallery_images: JSON.stringify([
      'https://via.placeholder.com/600x400?text=Gearbox+GB-750+View+1'
    ]),
    category: 'Transmission',
    is_featured: 1,
    is_active: 1,
    created_at: '2024-02-15T16:20:00Z',
    updated_at: '2024-02-15T16:20:00Z'
  },
  {
    id: 6,
    name: 'Air Compressor AC-1000',
    description: 'Energy-efficient air compressor for industrial use',
    detailed_description: 'The AC-1000 air compressor combines energy efficiency with reliable performance. Features intelligent control system and low maintenance requirements.',
    specifications: JSON.stringify({
      capacity: '1000 L/min',
      pressure: '10 bar',
      power: '75 kW',
      noise_level: '72 dB',
      type: 'Rotary screw'
    }),
    image_url: 'https://via.placeholder.com/600x400?text=Compressor+AC-1000',
    gallery_images: JSON.stringify([
      'https://via.placeholder.com/600x400?text=Compressor+AC-1000+View+1',
      'https://via.placeholder.com/600x400?text=Compressor+AC-1000+View+2'
    ]),
    category: 'Compressors',
    is_featured: 0,
    is_active: 1,
    created_at: '2024-03-01T08:30:00Z',
    updated_at: '2024-03-01T08:30:00Z'
  }
]

export const mockInquiries = [
  {
    id: 1,
    product_id: 1,
    product_name: 'Industrial Motor X-2000',
    customer_name: 'John Smith',
    customer_email: 'john@example.com',
    customer_phone: '+1 234 567 8900',
    message: 'I am interested in this motor for our production line. Can you provide more details about bulk pricing?',
    status: 'new',
    created_at: '2024-03-10T10:00:00Z'
  },
  {
    id: 2,
    product_id: 2,
    product_name: 'Hydraulic Pump HP-500',
    customer_name: 'Maria Garcia',
    customer_email: 'maria@example.com',
    customer_phone: '+34 123 456 789',
    message: 'Do you ship to Europe? What are the delivery times?',
    status: 'replied',
    created_at: '2024-03-09T14:30:00Z'
  },
  {
    id: 3,
    product_id: null,
    product_name: null,
    customer_name: 'David Chen',
    customer_email: 'david@example.com',
    customer_phone: '+86 138 0000 1234',
    message: 'Looking for custom manufacturing solutions. Can we schedule a call?',
    status: 'new',
    created_at: '2024-03-11T09:15:00Z'
  }
]

export const mockOrders = [
  {
    id: 'order_001',
    order_number: 'ORD-2024-001',
    amount: 5999.00,
    currency: 'USD',
    status: 'paid',
    payment_method: 'stripe',
    customer_email: 'customer1@example.com',
    customer_name: 'Alice Johnson',
    product_name: 'Industrial Motor X-2000',
    quantity: 1,
    created_at: '2024-03-01T10:00:00Z',
    paid_at: '2024-03-01T10:05:00Z'
  },
  {
    id: 'order_002',
    order_number: 'ORD-2024-002',
    amount: 3500.00,
    currency: 'USD',
    status: 'pending',
    payment_method: 'paypal',
    customer_email: 'customer2@example.com',
    customer_name: 'Bob Wilson',
    product_name: 'Hydraulic Pump HP-500',
    quantity: 1,
    created_at: '2024-03-05T14:30:00Z',
    paid_at: null
  }
]

// 模拟管理员账户
export const mockAdmins = [
  {
    username: 'admin',
    password: 'admin123', // 在实际应用中应该加密
    role: 'super_admin'
  },
  {
    username: 'user',
    password: 'user123',
    role: 'admin'
  }
]

export default {
  settings: mockSettings,
  products: mockProducts,
  inquiries: mockInquiries,
  orders: mockOrders,
  admins: mockAdmins
}
