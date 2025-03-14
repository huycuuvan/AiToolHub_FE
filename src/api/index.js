import axios from "axios";

class API {
  constructor(config) {
    this.axiosInstance = axios.create(config);
    this.abortControllers = {};
  }

  getAxiosInstance() {
    return this.axiosInstance;
  }

  get(url, config = {}) {
    const controller = new AbortController();
    const urlPath = url.split("?")[0] || url;
    if (this.abortControllers[urlPath]) {
      this.abortControllers[urlPath].abort();
    }
    this.abortControllers[urlPath] = controller;

    return this.axiosInstance
      .get(url, { ...config, signal: controller.signal })
      .finally(() => {
        delete this.abortControllers[urlPath];
      });
  }

  delete(url, config = {}) {
    return this.axiosInstance.delete(url, config);
  }

  post(url, data, config = {}) {
    return this.axiosInstance.post(url, data, config);
  }

  put(url, data, config = {}) {
    return this.axiosInstance.put(url, data, config);
  }

  patch(url, data, config = {}) {
    return this.axiosInstance.patch(url, data, config);
  }

  async download(url, config = {}) {
    const response = await this.axiosInstance.get(url, {
      ...config,
      responseType: "blob",
    });
    const blob = new Blob([response.data]);
    const urlBlob = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlBlob;

    const contentDisposition = response.headers["content-disposition"]?.match(
      /filename="(.+)"/
    ) || ["download"];
    const filename = contentDisposition[1] || "download";
    a.download = filename;

    a.click();
    window.URL.revokeObjectURL(urlBlob);
  }
}

export default API;
