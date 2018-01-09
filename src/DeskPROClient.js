const Response = require('./Response');
const axios = require('axios');

const API_PATH = '/api/v2';

/**
 * Makes requests to the DeskPRO API.
 */
class DeskPROClient {
  
  /**
   * Constructor
   * 
   * @param {String} helpdeskUrl
   */
  constructor(helpdeskUrl) {
    this.authKey   = null;
    this.authToken = null;
    this.client    = axios.create({
      baseURL: `${helpdeskUrl}${API_PATH}`
    });
  }
  
  /**
   * @returns {axios}
   */
  getAxios() {
    return this.client;
  }
  
  /**
   * @param {axios} client
   * @returns {DeskPROClient}
   */
  setAxios(client) {
    this.client = client;
    return this;
  }
  
  /**
   *
   * @param {Number} personId
   * @param {String} token
   * @returns {DeskPROClient}
   */
  setAuthToken(personId, token) {
    this.authToken = `${personId}:${token}`;
    return this;
  }
  
  /**
   * 
   * @param {Number} personId
   * @param {String} key
   * @returns {DeskPROClient}
   */
  setAuthKey(personId, key) {
    this.authKey = `${personId}:${key}`;
    return this;
  }
  
  /**
   * 
   * @param {String} endpoint
   * @returns {Promise.<T>|*}
   */
  get(endpoint) {
    return this.request('GET', endpoint);
  }
  
  /**
   * 
   * @param {String} endpoint
   * @param {*} body
   * @returns {Promise.<T>|*}
   */
  post(endpoint, body = null) {
    return this.request('POST', endpoint, body);
  }
  
  /**
   *
   * @param {String} endpoint
   * @param {*} body
   * @returns {Promise.<T>|*}
   */
  put(endpoint, body = null) {
    return this.request('PUT', endpoint, body);
  }
  
  /**
   *
   * @param {String} endpoint
   * @returns {Promise.<T>|*}
   */
  del(endpoint) {
    return this.request('DELETE', endpoint);
  }
  
  /**
   * 
   * @param {String} method
   * @param {String} endpoint
   * @param {*} body
   * @param {Object} headers
   * @returns {Promise.<T>|*}
   */
  request(method, endpoint, body = null, headers = {}) {
    const config = {
      url: endpoint,
      data: body,
      method: method,
      headers: this._makeHeaders(headers)
    };
    
    return this.client.request(config)
      .then((resp) => {
        if (resp.data === undefined || resp.data.data === undefined) {
          return resp;
        }
        
        return new Response(
          resp.data.data,
          resp.data.meta,
          resp.data.linked
        );
      })
      .catch((err) => {
        if (err.response.data === undefined) {
          throw err;
        }
        throw err.response.data;
      });
  }
  
  /**
   * 
   * @param {Object} headers
   * @returns {Object}
   * @private
   */
  _makeHeaders(headers = {}) {
    if (this.authToken) {
      headers['Authorization'] = `token ${this.authToken}`;
    } else if (this.authKey) {
      headers['Authorization'] = `key ${this.authKey}`;
    }
    
    return headers;
  }
}

module.exports = DeskPROClient;