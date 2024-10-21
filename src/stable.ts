export default async function algorithm(inputData: any): Promise<any> {
  // const result: Record<string, any> = {};
  // const stack: Array<{obj: any, parentKey: string}> = [{ obj: inputData, parentKey: '' }];

  // while (stack.length > 0) {
  //   const { obj, parentKey } = stack.pop()!;  // Use stack to avoid recursion

  //   for (const key of Object.keys(obj)) {
  //     const newKey = parentKey ? `${parentKey}.${key}` : key;

  //     // Directly push object-type entries into the stack, delaying recursive action
  //     if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
  //       stack.push({ obj: obj[key], parentKey: newKey });
  //     } else {
  //       result[newKey] = obj[key];  // Directly assign values to the result
  //     }
  //   }
  // }

  // return result;
}
