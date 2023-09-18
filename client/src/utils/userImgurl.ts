export function isValidURL(url: string) {
  // URL을 검사할 정규 표현식
  var urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

  // 정규 표현식과 매치하여 검사
  const userImgUrl = urlPattern.test(url);
  return userImgUrl
    ? url
    : 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80';
}
