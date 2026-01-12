"use strict";
const electron = require("electron");
const api = {
  ping: () => electron.ipcRenderer.invoke("ping"),
  rules: {
    list: () => electron.ipcRenderer.invoke("rules:list"),
    get: (id) => electron.ipcRenderer.invoke("rules:get", id),
    create: (params) => electron.ipcRenderer.invoke("rules:create", params),
    update: (params) => electron.ipcRenderer.invoke("rules:update", params),
    delete: (id) => electron.ipcRenderer.invoke("rules:delete", id)
  },
  mcp: {
    list: () => electron.ipcRenderer.invoke("mcp:list"),
    get: (id) => electron.ipcRenderer.invoke("mcp:get", id),
    create: (params) => electron.ipcRenderer.invoke("mcp:create", params),
    update: (params) => electron.ipcRenderer.invoke("mcp:update", params),
    delete: (id) => electron.ipcRenderer.invoke("mcp:delete", id),
    fetchConfigFromUrl: (url) => electron.ipcRenderer.invoke("mcp:fetchConfigFromUrl", url),
    import: (params) => electron.ipcRenderer.invoke("mcp:import", params)
  },
  sync: {
    start: () => electron.ipcRenderer.invoke("sync:start"),
    preview: (targetPath, type) => electron.ipcRenderer.invoke("sync:preview", targetPath, type),
    apply: (targetPath, content) => electron.ipcRenderer.invoke("sync:apply", targetPath, content),
    import: (filePath) => electron.ipcRenderer.invoke("sync:import", filePath),
    previewProject: (projectId) => electron.ipcRenderer.invoke("sync:previewProject", projectId)
  },
  toolIntegration: {
    generateConfig: (tool, scope, data) => electron.ipcRenderer.invoke("tool-integration:generate-config", tool, scope, data)
  },
  settings: {
    get: (key) => electron.ipcRenderer.invoke("settings:get", key),
    getAll: () => electron.ipcRenderer.invoke("settings:getAll"),
    set: (key, value) => electron.ipcRenderer.invoke("settings:set", key, value)
  },
  toolDetection: {
    detect: () => electron.ipcRenderer.invoke("tool-detection:detect"),
    getCached: () => electron.ipcRenderer.invoke("tool-detection:getCached")
  },
  dialog: {
    openDirectory: () => electron.ipcRenderer.invoke("dialog:openDirectory")
  },
  history: {
    list: () => electron.ipcRenderer.invoke("history:list"),
    revert: (id) => electron.ipcRenderer.invoke("history:revert", id)
  },
  sets: {
    mcp: {
      list: () => electron.ipcRenderer.invoke("sets:mcp:list"),
      create: (params) => electron.ipcRenderer.invoke("sets:mcp:create", params),
      update: (params) => electron.ipcRenderer.invoke("sets:mcp:update", params),
      delete: (id) => electron.ipcRenderer.invoke("sets:mcp:delete", id)
    },
    rules: {
      list: () => electron.ipcRenderer.invoke("sets:rules:list"),
      create: (params) => electron.ipcRenderer.invoke("sets:rules:create", params),
      update: (params) => electron.ipcRenderer.invoke("sets:rules:update", params),
      delete: (id) => electron.ipcRenderer.invoke("sets:rules:delete", id)
    },
    tools: {
      list: () => electron.ipcRenderer.invoke("sets:tools:list"),
      create: (params) => electron.ipcRenderer.invoke("sets:tools:create", params),
      update: (params) => electron.ipcRenderer.invoke("sets:tools:update", params),
      delete: (id) => electron.ipcRenderer.invoke("sets:tools:delete", id)
    }
  },
  projects: {
    list: () => electron.ipcRenderer.invoke("projects:list"),
    create: (params) => electron.ipcRenderer.invoke("projects:create", params),
    update: (params) => electron.ipcRenderer.invoke("projects:update", params),
    delete: (id) => electron.ipcRenderer.invoke("projects:delete", id),
    scan: (targetPath) => electron.ipcRenderer.invoke("projects:scan", targetPath)
  },
  toolConfig: {
    get: (toolId, contextId) => electron.ipcRenderer.invoke("tool-config:get", { toolId, contextId }),
    set: (params) => electron.ipcRenderer.invoke("tool-config:set", params),
    listProject: (projectId) => electron.ipcRenderer.invoke("tool-config:list-project", projectId)
  }
};
electron.contextBridge.exposeInMainWorld("api", api);
