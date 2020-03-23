import * as types from './types'
import * as api from './api'
export default {
    increment: ({
        commit
    }) => {
        commit(types.INCREMENT);
    },
    decrement: ({
        commit
    }) => {
        commit(types.DECREMENT);
    },
    clickOdd: ({
        commit,
        state
    }) => {
        if (state.mutations.count % 2 == 0) {
            commit(types.INCREMENT);
        }
    },
    clickAsync: ({
        commit
    }) => {
        new Promise((resolve) => {
            setTimeout(function() {
                commit(types.INCREMENT);
            }, 1000);
        })
    },
    add: ({ commit }, list) => {
        commit(types.ADD, list);
    },
    delet: ({ commit }, list) => {
        commit(types.DELET, list);
    },
    hide: ({ commit }, list) => {
        commit(types.HIDE, list);
    },
    show: ({ commit }, list) => {
        commit(types.SHOW, list);
    },
    add_a: ({ commit }) => {
        commit(types.ADD_A);
    },
    xzxm: ({ commit, state }, list) => {
        //console.debug(state.xmList);
        if (state.xmList.length == 0) {
            return api.xzxm().then(({ data }) => {
                commit(types.XZXM, { data, list })
            });
        } else {
            var data = [];
            commit(types.XZXM, { data, list });
        }

    },
    selectProj: ({ commit, state }, selectProjModel) => {
        //console.debug(selectProjModel);
        commit(types.selectProj, { selectProjModel })

    },
    selectProjCallback: ({ commit, state }, data) => {
        //console.info(vue);
        //console.info(state.selectProjModel);
        state.selectProjModel.projName = data.projName;
        state.selectProjModel.projUid = data.id;
        //console.info(state.selectProjModel.vue);
        //回调
        if (state.selectProjModel.vue != undefined) {
            if (state.selectProjModel.vue.afterSelectProj != undefined) {
                state.selectProjModel.vue.afterSelectProj(data);
            }

        }
        //console.info(data);
    }, updateMainFormHeight: ({ commit, state }, flag) => {
			//console.info("flag--------"+flag);
			//var dom = this.$refs.mainForm.$el;
			var dom = $('#mainForm');
			//console.info(dom);
			if (flag) {
				dom.css('padding-bottom', '67px');
			} else {
				dom.css('padding-bottom', '0px');
			}

		},
    xzkm: ({ commit, state }, list) => {
        if (state.kmList.length == 0) {
            return api.xzkm().then(({ data }) => {
                commit(types.XZKM, { data, list })
            });
        } else {
            var data = [];
            commit(types.XZKM, { data, list });
        }
        //commit(types.XZKM ,list);
    },
    gotoApproval: ({ commit }, item) => {
        commit(types.GOTOAPPROVAL, item);
    },
    gotoMovebx: ({ commit }, item) => {
        commit(types.GOTOMOVEBX, item);
    },
    gotoPointEdit: ({ commit }, item) => {
        commit(types.GOTOPOINTEDIT, item);
    }
}