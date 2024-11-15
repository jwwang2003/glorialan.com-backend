export async function reTryCatch(callback: () => Promise<any>, logger: (error: any) => any, times = 1): Promise<any> {
  try {
    return await callback()
  } catch (error) {
    if (times > 0) {
      if (logger) logger(error)
      return await reTryCatch(callback, logger, times - 1)
    } else {
      throw error
    }
  }
}