export function debounce(fn: any, ms: number) {
  let timer: any;
  return (_: void) => {
    clearTimeout(timer);
    timer = setTimeout((_) => {
      timer = null;
      //@ts-ignore
      fn.apply(this, arguments);
    }, ms);
  };
}
