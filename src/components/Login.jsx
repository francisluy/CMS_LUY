import { useRef } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import Spinner from "./ui/Spinner";

export default function Login() {
  const loadingRef = useRef(false);
  const isLoading = loadingRef.current;

  const schema = yup.object().shape({
    email: yup.string().email().required("Please enter a valid email."),
    password: yup.string().required("Please enter a valid password."),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onLogin = async (data) => {
    loadingRef.current = true;
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      reset();
    } catch (e) {
      alert("login failed");
      console.log(e);
    } finally {
      loadingRef.current = false;
    }
  };

  document.querySelector("body").addEventListener("mousemove", eyeball);

  function eyeball() {
    var eye = document.querySelectorAll(".eye");

    eye.forEach((eye) => {
      let x = eye.getBoundingClientRect().left + eye.clientWidth / 2;
      let y = eye.getBoundingClientRect().top + eye.clientHeight / 2;
      let radian = Math.atan2(event.pageX - x, event.pageY - y);
      let rot = radian * (180 / Math.PI) * -1 + 270;
      eye.style.transform = "rotate(" + rot + "deg)";
    });
  }

  return (
    <div className="flex w-full flex-col items-center justify-center px-4">
      <div className="face">
        <div className="eyes">
          <div className="eye"></div>
          <div className="eye"></div>
        </div>
      </div>
      <div className="relative bottom-16 h-[300px] w-full max-w-[500px]">
        <h1 className="py-8 text-center text-2xl font-semibold">CMS Login</h1>
        <form onSubmit={handleSubmit(onLogin)} className="space-y-8">
          <div>
            <p>Email</p>
            <input
              type="text"
              placeholder="example@email.com"
              className="input w-full"
              disabled={isLoading ? true : false}
              {...register("email")}
            />
            <p className="input-status">{errors.email?.message}</p>
          </div>

          <div className="pb-8">
            <p>Password</p>
            <input
              type="password"
              placeholder="password"
              className="input w-full"
              disabled={isLoading ? true : false}
              {...register("password")}
            />
            <p className="input-status">{errors.password?.message}</p>
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white"
            disabled={isLoading ? true : false}
          >
            {isLoading ? <Spinner /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
