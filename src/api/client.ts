export async function postJSON(url: string, data: unknown): Promise<Response> {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

export async function getJSON<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export interface KYCStatus {
  role: 'buyer' | 'seller'
  status: 'approved' | 'referred' | 'declined' | 'pending' | null
  inquiryId?: string
}

export async function fetchKYCStatus(role: 'buyer' | 'seller'): Promise<KYCStatus> {
  try {
    const response = await fetch(`/api/kyc/status?role=${role}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Expected JSON response, got ${contentType}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch KYC status:', error)
    return { role, status: null }
  }
}

export async function completeKYC(role: 'buyer' | 'seller', inquiryId: string, status: string): Promise<void> {
  try {
    await postJSON(`/api/kyc/${role}/complete`, { inquiryId, status })
  } catch (error) {
    console.error(`Failed to complete ${role} KYC:`, error)
    throw error
  }
}