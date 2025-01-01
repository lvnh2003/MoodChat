/**
 * クライアント一覧を取得するAPI
 * import { getClient } from '@/features/Client/api/getClient';
 */

import api from '@/lib/api';

interface Params {
  text: string;
}

export const checkMood = async ({ text }: Params) => {
  try {
    const response = await api.post(`/analyze-sentiment`,{text: text});
    return response.data;
  } catch (error) {
    console.error('Failed to post:', error);
    throw error;
  }
};
