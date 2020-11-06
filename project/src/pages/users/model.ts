import { Reducer, Subscription, Effect } from 'umi';
import { getRemoteList, editRecord, deleteUser, addUser } from './service';
import { message } from 'antd';

interface SingleUserType {
  id: number,
  name: string,
  email: string,
  create_time: string,
  update_time: string,
  status: number
}

interface UserState {
  data: SingleUserType[];
  meta: {
    total: number,
    per_page: number,
    page: number
  }
}

interface UserModalType {
  namespace: 'users';
  state: UserState;
  reducers: {
    getList: Reducer<UserState>
  },
  effects: {
    getRemote:  Effect,
    edit: Effect,
    delete: Effect,
    add: Effect,
  },
  subscriptions: {
    setup: Subscription
  }

}
const UseModal: UserModalType = {
  namespace: 'users',
  state: {
    data:[],
    meta: {
      total: 0,
      per_page: 5,
      page: 1
    }
  },
  reducers: {
    getList(state, {type, payload}) {
      return payload;
    }
  },
  effects: {
    *getRemote(action, {put, call}) {
      const data = yield call(getRemoteList);
      if (data) {
        yield put({
        type: 'getList',
        payload: data
      })
    }
    },
    *edit({payload:{values, id}}, {put, call}) {
      const data = yield call(editRecord, {values, id});
      if (data) {
        message.success('Edit successfully');
        yield put({
          type: 'getRemote',
        })
      }else {
        message.error('Edit failed');
      }
    },
    *delete({payload:{id}}, {put, call}) {
      const data = yield call(deleteUser, id);
      if (data) {
        message.success('Delete successfully');
        yield put({
          type: 'getRemote',
        })
      }else {
        message.error('Delete failed');
      }
    },
    *add({payload:{values}}, {put, call}) {
      const data = yield call(addUser, values);
      if (data) {
        message.success('Add successfully');
        yield put({
          type: 'getRemote',
        })
      }else {
        message.error('Add failed');
      }
    },
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname}) => {
        if(pathname === '/users'){
          dispatch({
            type: 'getRemote',
            payload: {
              page: 1,
              per_page: 5
            }
          }
          )
        }
      })
    },
  }
}

export default UseModal