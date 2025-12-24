const ORDER_STATUS: Object = {
  0: { color: 'processing', text: '待配送' },
  1: { color: 'success', text: '已结算' },
  2: { color: 'warning', text: '延期结算' },
  // 1: { color: 'cyan', text: '已结算' },
}

const ORDER_PRINT_STATUS: Object = {
  1: { color: 'warning', text: '未打印' },
  2: { color: 'success', text: '已打印' },
  3: { color: 'orange', text: '修改后未打印' },
}


export { ORDER_STATUS, ORDER_PRINT_STATUS }