import { GrFormClose } from "react-icons/gr";
import { useAppDispatch, useAppSelector } from "../Store/store";
import { setIsNotify, setNotify } from "../Features/User/userSlice";
// import { clearErrors } from "../Features/Error/errorSlice";
import { useEffect } from "react";

export const Notification = () => {
  const dispatch = useAppDispatch();
  const { notify, isNotify } = useAppSelector((state) => state.user);
  // const { errors } = useAppSelector((state) => state.error);

  useEffect(() => {
    if (isNotify) {
      const timeoutId = setTimeout(() => {
        // dispatch(clearErrors());
        dispatch(setNotify(null));
        dispatch(setIsNotify(false));
      }, 5000);

      // Clear the timeout when the component unmounts to prevent memory leaks
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [dispatch, isNotify]);

  return (
    <div className="notification">
      <div
        className="notify-bar"
        style={{ backgroundColor: notify?.color }}
      ></div>
      <div className="notify-text">{notify?.text}</div>
      <GrFormClose
        onClick={() => {
          dispatch(setIsNotify(false));
          // dispatch(clearErrors());
        }}
      />
    </div>
  );
};
