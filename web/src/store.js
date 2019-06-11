import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    connectors: [],
    connect_servers: []
  },
  getters: {
    connectors(state) {
      return state.connectors;
    },
    connect_servers(state) {
      return state.connect_servers;
    },
    connect_server_hostnames(state) {
      return state.connect_servers.map(s => {
        return s.hostname;
      });
    }
  },
  mutations: {
    setConnectors(state, c) {
      state.connectors = c;
    },
    setConnectServers(state, s) {
      s = s.map(server => {
        server.hostname = server.hostname.replace(/\/+$/, "");
        server["status"] = 0;

        return server;
      });

      state.connect_servers = s;
    },
    setConnectServersHealth(state, h) {
      let servers = state.connect_servers;

      h.forEach(server => {
        for (var i = 0, len = servers.length; i < len; i++) {
          if (servers[i].hostname === server.server) {
            servers[i].status = server.status;
          }
        }
      });

      state.connect_servers = servers;
    }
  },
  actions: {
    /**
     * @param  {} {commit}
     */
    async getConnectors({ commit }) {
      let c = await axios.get("http://localhost:3000/connectors");

      if (c.status !== 200) {
        commit("setConnectors", []);

        return false;
      }

      if (!c.data.success) {
        commit("setConnectors", []);

        return false;
      }

      commit("setConnectors", c.data.results);

      return true;
    },
    /**
     * @param  {} {commit
     * @param  {} state}
     * @param  {} id
     */
    async deleteConnector({ commit, state }, id) {
      let d = await axios.delete("http://localhost:3000/connector/" + id);

      if (d.status !== 200) {
        return false;
      }

      if (!d.data.success) {
        return false;
      }

      let c = state.connectors;

      for (var i = 0, len = c.length; i < len; i++) {
        if (c[i]._id === id) {
          c.splice(i, 1);

          commit("setConnectors", c);

          return true;
        }
      }

      return false;
    },
    /**
     * @param  {} {commit
     * @param  {} state}p
     */
    async addConnector({ commit, state, dispatch }, p) {
      let b = {
        name: p.name || p.reference,
        reference: p.reference,
        configuration: p.configuration,
        type: p.type
      };

      let r = await axios.post("http://localhost:3000/connector", b);

      if (r.status !== 200) {
        return false;
      }

      if (!r.data.success) {
        return false;
      }

      await dispatch("getConnectors");
      return true;
    },
    /**
     * @param  {} {commit}
     */
    async getConnectServers({ commit }) {
      let c = await axios.get("http://localhost:3000/connect_servers");

      if (c.status !== 200) {
        commit("setConnectServers", []);

        return false;
      }

      if (!c.data.success) {
        commit("setConnectServers", []);

        return false;
      }

      commit("setConnectServers", c.data.results);

      return true;
    },
    /**
     * @param  {} {commit
     * @param  {} state}
     * @param  {} id
     */
    async deleteConnectServer({ commit, state }, id) {
      let d = await axios.delete("http://localhost:3000/connect_server/" + id);

      if (d.status !== 200) {
        return false;
      }

      if (!d.data.success) {
        return false;
      }

      let c = state.connect_servers;

      for (var i = 0, len = c.length; i < len; i++) {
        if (c[i]._id === id) {
          c.splice(i, 1);

          commit("setConnectServers", c);

          return true;
        }
      }

      return false;
    },
    /**
     * @param  {} {commit
     * @param  {} state}p
     */
    async addConnectServer({ commit, state, dispatch }, p) {
      let b = {
        name: p.name,
        hostname: p.hostname
      };

      let r = await axios.post("http://localhost:3000/connect_servers", b);

      if (r.status !== 200) {
        return false;
      }

      if (!r.data.success) {
        return false;
      }

      dispatch("checkConnectServerHealth");

      await dispatch("getConnectServers");
      return true;
    },
    /**
     * @param  {} {commit
     * @param  {} state
     * @param  {} getters}
     */
    async checkConnectServerHealth({ commit, state, getters }) {
      if (getters.connect_server_hostnames.length === 0) {
        return;
      }

      let hosts = getters.connect_server_hostnames.map(sh => {
        return encodeURI(sh);
      });

      let h = await axios.post("http://localhost:3000/connect_servers/health", {
        servers: hosts
      });

      if (h.status !== 200) {
        return false;
      }

      commit("setConnectServersHealth", h.data);
      return h.data;
    },
    /**
     * @param  {} {}
     * @param  {} p
     */
    async addEnvironmentVariable({ dispatch }, p) {
      let a = await axios.post(
        "http://localhost:3000/connect_server/environment_variable",
        p
      );

      if (a.status !== 200) {
        return false;
      }

      if (!a.data.success) {
        return false;
      }

      await dispatch("getConnectServers");
      return true;
    },
    async deleteEnvironmentVariable({ dispatch }, p) {
      let a = await axios.delete(
        "http://localhost:3000/connect_server/environment_variable/" +
          p.server_id +
          "/" +
          p.environment_variable_id,
        p
      );

      if (a.status !== 200) {
        return false;
      }

      if (!a.data.success) {
        return false;
      }

      await dispatch("getConnectServers");
      return true;
    },
    async updateConnectorConfiguration({ dispatch }, p) {
      let a = await axios.patch("http://localhost:3000/connector", {
        _id: p._id,
        configuration: p.configuration
      });

      if (a.status !== 200) {
        return false;
      }

      if (!a.data.success) {
        return false;
      }

      await dispatch("getConnectors");
      return true;
    }
  }
});
