import { customerSelect } from "#/api"

 async function customerSelector(){
  const data = await customerSelect()
  return data.list.map(item=>{
    return {
      label: item.name,
      value: item.id,
    }
  })
}

export { customerSelector }