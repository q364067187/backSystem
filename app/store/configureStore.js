// redux存储
import { createStore } from "redux";
import rootReducer from "../reducers";

export default function configureStore(initialState){
	const store = createStore(rootReducer, initialState,
		// 防止node读取不到
		function(){
			try{
				// 触发redux-devtools
				return window.devToolsExtension ? window.devToolsExtension() : undefined;
			}catch(ex){
				return undefined;
			}
		}()
	);
	return store;
};
