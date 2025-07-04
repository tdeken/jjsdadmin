/** 用户信息 */
interface SelectOption {
  /**
   * 选项
   */
  label?: string;
  /**
   * 选项值
   */
  value?: string;
  
  [key: string]: any
}

/** 表单操作 */
interface CudInterface {
  delete:(row: any)=>void;
  update:(row: any)=>void;
  create:()=>void;
}

export type { SelectOption, CudInterface };
