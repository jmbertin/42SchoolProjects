import axios from 'axios';
import {CLIENT_ID, CLIENT_SECRET} from '@env';

const api = axios.create({
  baseURL: 'https://api.intra.42.fr/v2',
});

export const api42 = {
  authURL: 'https://api.intra.42.fr/oauth/authorize',
  tokenURL: 'https://api.intra.42.fr/oauth/token',
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: 'projects42://callback',

  getAuthURL: function () {
    return `${this.authURL}?client_id=${
      this.clientId
    }&redirect_uri=${encodeURIComponent(
      this.redirectUri,
    )}&response_type=code&scope=public%20profile%20projects`;
  },

  async getAccessToken(code: string) {
    try {
      const response = await axios.post(this.tokenURL, null, {
        params: {
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code: code,
          redirect_uri: this.redirectUri,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data.access_token;
    } catch (error) {
      console.log('Error getting token', error);
      throw error;
    }
  },

  async getAppAccessToken() {
    try {
      const response = await axios.post(this.tokenURL, null, {
        params: {
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data.access_token;
    } catch (error) {
      console.log('Error getting app token', error);
      throw error;
    }
  },

  async getUserProfile(accessToken: string) {
    try {
      const response = await api.get('me', {
        headers: {Authorization: `Bearer ${accessToken}`},
      });
      // console.log(JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.log('Error fetching profile datas', error);
      throw error;
    }
  },

  async getMyProjetcs(accessToken: string) {
    try {
      const response = await api.get('me/projects', {
        headers: {Authorization: `Bearer ${accessToken}`},
      });
      // console.log(JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.log('Error fetching projects datas', error);
      throw error;
    }
  },

  delay: function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  async getProjectsFromMyCampus(appAccessToken, campusId) {
    try {
      const allProjects = [];
      const appAccessToken = await this.getAppAccessToken();

      const initialResponse = await api.get('project_sessions', {
        params: {
          'page[number]': 1,
          'page[size]': 1,
          'filter[campus_id]': campusId,
          'filter[cursus_id]': 21,
        },
        headers: { Authorization: `Bearer ${appAccessToken}` },
      });

      const totalItems = parseInt(initialResponse.headers['x-total'], 10);
      const totalPages = Math.ceil(totalItems / 100);

      for (let page = 1; page <= totalPages; page++) {
        await this.delay(600);

        const response = await api.get('project_sessions', {
          params: {
            'page[number]': page,
            'page[size]': 100,
            'filter[campus_id]': campusId,
            'filter[cursus_id]': '21',
          },
          headers: { Authorization: `Bearer ${appAccessToken}` },
        });

        allProjects.push(...response.data);
      }
      return allProjects;
    } catch (error) {
      console.log('Error fetching projects data', error.response?.data || error.message);
      throw error;
    }
  },
};

export default api42;
