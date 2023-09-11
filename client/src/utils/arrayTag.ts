export function arrayTag(inputString: string) {
  // 쉼표로 단어들을 분리하고, 배열로바꾸기
  return inputString.split(',').map((word) => word.trim());
}
