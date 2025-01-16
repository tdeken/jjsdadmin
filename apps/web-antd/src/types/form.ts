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

}

interface CudInterface {
  openForm:(state :any, data: any)=>void;
  delete:(row: any)=>void;
  update:(row: any)=>void;
  create:()=>void;
}

export type { SelectOption, CudInterface };
