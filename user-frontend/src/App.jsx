
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { loadUser } from "./redux/thunks/authThunks/AuthThunk";
// import {loadUser} from "./redux/thunks/authThunks/authThunk";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  return <AppRoutes />;
};
export default App;
