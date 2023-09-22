export function findAndShowSubstring(sentence: string, target: string) {
  // 문장에서 대상 문자열의 인덱스를 찾습니다.
  const index = sentence.indexOf(target);

  // 대상 문자열이 문장에 없거나 인덱스가 -1인 경우 처리합니다.
  if (index === -1) {
    return ['대상 문자열을 찾을 수 없습니다.', '', ''];
  }

  // 대상 문자열 주변의 5글자를 추출합니다.
  const start = Math.max(0, index - 10);
  const end = Math.min(sentence.length, index + target.length + 10);

  // 추출한 문자열을 배열로 반환합니다.
  const beforeTarget = sentence.substring(start, index);
  const targetSubstring = sentence.substring(index, index + target.length);
  const afterTarget = sentence.substring(index + target.length, end);

  return [beforeTarget, targetSubstring, afterTarget];
}
