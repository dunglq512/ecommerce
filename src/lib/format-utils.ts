/**
 * Định dạng số thành chuỗi có dấu phân cách hàng nghìn (ví dụ: 1000000 -> 1,000,000)
 */
export function formatVND(value: string | number): string {
  if (value === undefined || value === null || value === "") return ""
  
  // Loại bỏ các ký tự không phải số
  const stringValue = value.toString().replace(/\D/g, "")
  if (!stringValue) return ""
  
  // Định dạng lại với dấu phân cách hàng nghìn (dấu phẩy)
  return new Intl.NumberFormat("en-US").format(parseInt(stringValue))
}

/**
 * Định dạng hiển thị tiền tệ (ví dụ: 1,000,000 ₫)
 */
export function formatCurrencyVND(value: number | null | undefined): string {
  if (value === null || value === undefined) return "0 ₫"
  return `${new Intl.NumberFormat("en-US").format(value)} ₫`
}

/**
 * Chuyển chuỗi có dấu phân cách ngược lại thành số (ví dụ: 1,000,000 -> 1000000)
 * Hỗ trợ cả dấu phẩy và dấu chấm để đề phòng nhầm lẫn
 */
export function parseVND(value: string | number): number {
  if (value === undefined || value === null || value === "") return 0
  
  if (typeof value === "number") return value

  // Loại bỏ tất cả dấu phẩy và dấu chấm, chỉ giữ lại số
  const cleanValue = value.replace(/[,.]/g, "")
  return cleanValue ? parseInt(cleanValue) : 0
}
