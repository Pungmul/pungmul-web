export interface ProfileImage {
  id: number;
  originalFilename: string;
  convertedFileName: string;
  fullFilePath: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

export interface User {
  userId: number;
  username: string;
  name: string;
  profileImage: ProfileImage;
}