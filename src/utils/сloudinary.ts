import axios from "axios";
import { Cloudinary } from "@cloudinary/url-gen";

const baseUrl = import.meta.env.VITE_CLOUDINARY_BASEURL;

export const uploadAvatar = async (file: File, userID: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('public_id', `avatars/${userID}/thumbnail`);
  formData.append('upload_preset', 'public_avatars_thumbnail');

  try {
    await axios.post(`${baseUrl}/image/upload`, formData);

    formData.set('public_id', `avatars/${userID}`);
    formData.set('upload_preset', 'public_avatars');
    const { data } = await axios.post(`${baseUrl}/image/upload`, formData);

    console.log(data);

    return data;
  } catch(e) {
    console.error(e);
  }
};

export const cld = new Cloudinary({
  cloud: {
    cloudName: 'dseh26kha'
  }
});
