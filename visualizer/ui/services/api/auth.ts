import axios from "../axios";
import { User } from "@/types/auth";




// export const s


// Mock authentication functions (in a real app, these would call actual auth providers)
export const signInWithGoogle = async (): Promise<User> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: "google-user-1",
    name: "John Doe",
    email: "john.doe@gmail.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
    provider: "google",
  }
}

export const signInWithGitHub = async (): Promise<User> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: "github-user-1",
    name: "Jane Smith",
    email: "jane.smith@github.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b9c5e8e1?w=32&h=32&fit=crop&crop=face",
    provider: "github",
  }
}

export const signInAsDemo = async (): Promise<User> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    id: "demo-user-1",
    name: "Demo User",
    email: "demo@example.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face",
    provider: "demo",
  }
}

export const signOut = async (): Promise<void> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
}





// // Update user created highlight clip's permission -> public / private
// let updateHighlightBuilderClipPermissionApiCanceller;
// export const updateHighlightBuilderClipPermission = async (
//   isPublic: boolean,
//   clipId: string
// ) => {
//   if (updateHighlightBuilderClipPermissionApiCanceller) {
//     updateHighlightBuilderClipPermissionApiCanceller(AJAX_CANCEL);
//   }

//   try {
//     const { data } = await axios({
//       url: `/v1/highlight-builder/${clipId}/permission`,
//       method: 'PUT',
//       data: {
//         isPublic,
//       },
//       cancelToken: new CancelToken(function executor(apiCanceller) {
//         updateHighlightBuilderClipPermissionApiCanceller = apiCanceller;
//       }),
//     });
//     return data;
//   } catch (err) {
//     console.log(new Error(err));
//   }
// };