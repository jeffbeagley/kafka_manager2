<template>
    <b-container>
        <b-row>
            <b-col cols="12">
                <h4 class="mt-5">Connectors</h4>
                <b-card no-body>
                    <b-tabs pills card vertical>
                        <b-tab title="Servers" active>
                            <b-row class="mb-1">
                                <b-col cols="12">
                                    <b-button-toolbar
                                        key-nav
                                        aria-label="Toolbar with button groups"
                                        class="float-right"
                                    >
                                        <b-button-group class="mx-1 float-right">
                                            <b-button
                                                size="sm"
                                                variant="primary"
                                                v-b-modal.modal-server
                                            >Add Connect Server</b-button>
                                        </b-button-group>
                                    </b-button-toolbar>
                                </b-col>
                            </b-row>
                            <b-row v-if="connect_servers.length == 0" class="mb-1">
                                <b-col cols="12">
                                    <b-alert
                                        show
                                    >You have not added any Connect Servers, click "Add Connect Instance" to add your first one.</b-alert>
                                </b-col>
                            </b-row>
                            <b-row class="mb-1">
                                <b-col cols="12">
                                    <b-list-group>
                                        <b-list-group-item
                                            v-for="server in connect_servers"
                                            v-bind:key="server._id"
                                            href="#"
                                            class="flex-column align-items-start"
                                        >
                                            <b-row>
                                                <b-col cols="12">
                                                    <div
                                                        class="d-flex w-100 justify-content-between"
                                                    >
                                                        <h5 class="mb-1">{{ server.name }}</h5>
                                                        <small>Created: {{ server.createdAt }}</small>
                                                    </div>Status:
                                                    <b-spinner
                                                        v-if="server.status == 0"
                                                        small
                                                        variant="primary"
                                                        label="Spinning"
                                                    ></b-spinner>
                                                    <b-badge
                                                        v-if="server.status == 200"
                                                        variant="success"
                                                    >Active</b-badge>
                                                    <b-badge
                                                        v-if="server.status > 300"
                                                        variant="danger"
                                                    >Error</b-badge>
                                                </b-col>
                                            </b-row>
                                            <b-row>
                                                <b-col cols="8">
                                                    <p>Environment Variables</p>
                                                    <b-table
                                                        striped
                                                        hover
                                                        small
                                                        fixed
                                                        responsive
                                                        :items="server.environment_variables"
                                                        :fields="environment_variables_fields"
                                                    >
                                                        <template slot="action" slot-scope="data">
                                                            <b-button
                                                                size="sm"
                                                                @click="deleteEnvironmentVariableClick(server._id, data.item._id)"
                                                            >Delete</b-button>
                                                        </template>
                                                    </b-table>
                                                    <b-button
                                                        variant="primary"
                                                        size="sm"
                                                        @click="addEnvironmentVariableClick(server._id)"
                                                    >Add Value</b-button>
                                                </b-col>
                                            </b-row>

                                            <b-button-toolbar
                                                key-nav
                                                aria-label="Toolbar with button groups"
                                                class="float-right"
                                            >
                                                <b-button-group class="mx-1 float-right">
                                                    <b-button
                                                        variant="danger"
                                                        size="sm"
                                                        @click="deleteConnectServerClick(server._id)"
                                                    >Delete</b-button>
                                                </b-button-group>
                                            </b-button-toolbar>
                                        </b-list-group-item>
                                    </b-list-group>
                                </b-col>
                            </b-row>
                        </b-tab>
                        <b-tab title="Configurations">
                            <b-row class="mb-1">
                                <b-col cols="12">
                                    <b-button-toolbar
                                        key-nav
                                        aria-label="Toolbar with button groups"
                                        class="float-right"
                                    >
                                        <b-button-group class="mx-1 float-right">
                                            <b-button
                                                size="sm"
                                                variant="primary"
                                                @click="getConnectors"
                                            >Reload</b-button>
                                            <b-button
                                                size="sm"
                                                variant="primary"
                                                v-b-modal.modal-1
                                            >Add New</b-button>
                                        </b-button-group>
                                    </b-button-toolbar>
                                </b-col>
                            </b-row>
                            <b-row class="mb-1">
                                <b-col cols="12">
                                    <b-list-group>
                                        <b-list-group-item
                                            v-for="connector in connectors"
                                            v-bind:key="connector._id"
                                            href="#"
                                            class="flex-column align-items-start"
                                        >
                                            <div class="d-flex w-100 justify-content-between">
                                                <h5 class="mb-1">{{ connector.reference }}</h5>
                                                <small>Created: {{ connector.createdAt }}</small>
                                            </div>

                                            <div>
                                                <dl
                                                    class="row"
                                                    v-for="server in connect_servers"
                                                    :key="server._id"
                                                >
                                                    <dt class="col-sm-3">{{ server.name }}</dt>
                                                    <dd class="col-sm-9">
                                                        <b-badge
                                                            variant="success"
                                                            v-if="connector.deployed_to.includes(server._id)"
                                                        >Deployed</b-badge>
                                                        <b-badge
                                                            variant="info"
                                                            v-if="!connector.deployed_to.includes(server._id)"
                                                        >Not Deployed</b-badge>
                                                    </dd>
                                                </dl>
                                            </div>
                                            <b-button-toolbar
                                                key-nav
                                                aria-label="Toolbar with button groups"
                                                class="float-right"
                                            >
                                                <b-button-group class="mx-1 float-right">
                                                    <b-button
                                                        size="sm"
                                                        variant="primary"
                                                        @click="viewDetails(connector)"
                                                    >View Details</b-button>
                                                    <b-button
                                                        variant="danger"
                                                        size="sm"
                                                        @click="deleteConnectorClick(connector._id)"
                                                    >Delete</b-button>
                                                </b-button-group>
                                            </b-button-toolbar>
                                        </b-list-group-item>
                                    </b-list-group>
                                </b-col>
                            </b-row>
                        </b-tab>
                    </b-tabs>
                </b-card>
            </b-col>
        </b-row>
        <b-modal id="modal-server" title="Add New Connect Instance" size="lg">
            <b-form>
                <b-form-group
                    id="input-group-1"
                    label="Name:"
                    label-for="input-1"
                    description="This is just a name for tracking purposes and has no effect on the actual instance itself"
                >
                    <b-form-input
                        v-model="server.name"
                        type="text"
                        required
                        placeholder="Enter a Name"
                    ></b-form-input>
                </b-form-group>
                <b-form-group
                    id="input-group-1"
                    label="Hostname:"
                    label-for="input-1"
                    description="Place <url>:<port> to your Connect Instance"
                >
                    <b-form-input
                        v-model="server.hostname"
                        type="text"
                        required
                        placeholder="Enter a Hostname"
                    ></b-form-input>
                </b-form-group>
            </b-form>
            <template slot="modal-footer" slot-scope="{ ok, cancel }">
                <!-- Emulate built in modal footer ok and cancel button actions -->
                <b-button size="sm" @click="cancel()">Cancel</b-button>
                <b-button size="sm" variant="primary" @click="addNewServer()">Add</b-button>
            </template>
        </b-modal>

        <b-modal id="modal-1" title="Add New" size="lg">
            <b-form>
                <b-form-group
                    id="input-group-1"
                    label="Reference:"
                    label-for="input-1"
                    description="This is just for visual reference, and is not used in actual configuration"
                >
                    <b-form-input
                        id="input-1"
                        v-model="form.reference"
                        type="text"
                        required
                        placeholder="Enter a Reference"
                    ></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-3" label="Type:" label-for="input-3">
                    <b-form-select id="input-3" v-model="form.type" :options="types" required></b-form-select>
                </b-form-group>
                <b-form-group
                    id="input-group-1"
                    label="Configuration:"
                    label-for="input-1"
                    description="Place your JSON Configuration here"
                >
                    <b-form-textarea
                        id="textarea"
                        v-model="form.configuration"
                        placeholder="Enter JSON here"
                        rows="10"
                        max-rows="6"
                    ></b-form-textarea>
                </b-form-group>
            </b-form>
            <template slot="modal-footer" slot-scope="{ ok, cancel }">
                <!-- Emulate built in modal footer ok and cancel button actions -->
                <b-button size="sm" @click="cancel()">Cancel</b-button>
                <b-button size="sm" variant="primary" @click="addNew">Add</b-button>
            </template>
        </b-modal>

        <b-modal id="modal-environment_variable" title="Add new Environment Variable" size="lg">
            <b-form>
                <b-form-group id="input-group-1" label="Key:" label-for="input-1">
                    <b-form-input
                        id="input-1"
                        v-model="environment_variable.key"
                        type="text"
                        required
                    ></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-1" label="Value:" label-for="input-1">
                    <b-form-input
                        id="input-1"
                        v-model="environment_variable.value"
                        type="text"
                        required
                    ></b-form-input>
                </b-form-group>
            </b-form>
            <template slot="modal-footer" slot-scope="{ ok, cancel }">
                <!-- Emulate built in modal footer ok and cancel button actions -->
                <b-button size="sm" @click="cancel()">Cancel</b-button>
                <b-button size="sm" variant="primary" @click="addEnvironmentVariableSubmit()">Add</b-button>
            </template>
        </b-modal>

        <b-modal id="details-modal" title="Details" size="lg">
            <b-form>
                <b-form-group id="input-group-1" label="Configuration:" label-for="input-1">
                    <b-form-textarea
                        id="textarea"
                        v-model="current_connector.configuration"
                        placeholder="Enter JSON here"
                        rows="10"
                        max-rows="6"
                    ></b-form-textarea>
                </b-form-group>
            </b-form>
            <template slot="modal-footer" slot-scope="{ ok, cancel }">
                <!-- Emulate built in modal footer ok and cancel button actions -->
                <b-button size="sm" @click="cancel()">Cancel</b-button>
                <b-button size="sm" variant="primary" @click="saveConfigurationSubmit()">Save</b-button>
            </template>
        </b-modal>
    </b-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { setInterval } from "timers";
import axios from "axios";
import { runInThisContext } from "vm";

export default {
    name: "connectors",
    data() {
        return {
            fields: ["reference", "type", "actions"],
            environment_variables_fields: ["key", "value", "action"],
            types: ["Connector", "Sink"],
            form: {
                name: "",
                type: "Connector",
                configuration: ""
            },
            environment_variable: {
                id: 0,
                key: "",
                value: ""
            },
            server: {
                name: "",
                hostname: ""
            },
            timer_connect_server: null,
            current_connector: {
                _id: null,
                configuration: null
            }
        };
    },
    computed: {
        ...mapGetters(["connectors", "connect_servers"]),
        connect_server_hostnames() {
            return this.connect_servers.map(s => {
                return s.hostname;
            });
        }
    },
    methods: {
        ...mapActions([
            "getConnectors",
            "deleteConnector",
            "addConnector",
            "getConnectServers",
            "deleteConnectServer",
            "addConnectServer",
            "checkConnectServerHealth",
            "addEnvironmentVariable",
            "deleteEnvironmentVariable",
            "updateConnectorConfiguration"
        ]),
        async deleteConnectorClick(id) {
            let self = this;

            this.$bvModal
                .msgBoxConfirm("Are you sure?")
                .then(async value => {
                    if (value) {
                        await self.deleteConnector(id);
                    }
                })
                .catch(err => {
                    // An error occurred
                });
        },
        async addNew() {
            let p = {
                reference: this.form.reference,
                configuration: this.form.configuration,
                type: this.form.type
            };

            let r = await this.addConnector(p);

            if (r) {
                this.$bvModal.hide("modal-1");
            }
        },
        async addNewServer() {
            let p = {
                name: this.server.name,
                hostname: this.server.hostname
            };

            let r = await this.addConnectServer(p);

            if (r) {
                this.$bvModal.hide("modal-server");
            }
        },
        async viewDetails(connector) {
            this.current_connector.configuration = connector.configuration;
            this.current_connector._id = connector._id;

            this.$bvModal.show("details-modal");
        },
        async deleteConnectServerClick(id) {
            let self = this;

            this.$bvModal
                .msgBoxConfirm("Are you sure?")
                .then(async value => {
                    if (value) {
                        await self.deleteConnectServer(id);
                    }
                })
                .catch(err => {
                    // An error occurred
                });
        },
        setTimers() {
            this.timer_connect_server = setInterval(() => {
                this.checkConnectServerHealth();
            }, 5000);
        },
        addEnvironmentVariableClick(id) {
            this.environment_variable.id = id;

            this.$bvModal.show("modal-environment_variable");
        },
        async addEnvironmentVariableSubmit() {
            let r = await this.addEnvironmentVariable(
                this.environment_variable
            );

            if (r) {
                this.$bvModal.hide("modal-environment_variable");
            }
        },
        async deleteEnvironmentVariableClick(connect_server_id, ev_id) {
            let self = this;

            this.$bvModal
                .msgBoxConfirm("Are you sure?")
                .then(async value => {
                    if (value) {
                        await self.deleteEnvironmentVariable({
                            server_id: connect_server_id,
                            environment_variable_id: ev_id
                        });
                    }
                })
                .catch(err => {
                    // An error occurred
                });
        },
        async saveConfigurationSubmit() {
            let s = await this.updateConnectorConfiguration(
                this.current_connector
            );

            if (!s) {
                return false;
            }

            this.$bvModal.hide("modal-environment_variable");

            return true;
        }
    },
    async mounted() {
        let self = this;

        await this.getConnectors();
        await this.getConnectServers();

        this.setTimers();

        this.checkConnectServerHealth();
    },
    beforeDestroy() {
        clearInterval(this.timer_connect_server._id);
    }
};
</script>
