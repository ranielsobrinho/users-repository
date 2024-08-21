export async function validate(params: any): Promise<string> {
  let paramError = ''
  Object.values(params).forEach((param, index) => {
    if (param === null || param === '' || param === undefined) {
      paramError = Object.keys(params)[index]
    }
  })
  return paramError
}
