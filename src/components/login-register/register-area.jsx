import React from "react";
import Link from "next/link";
// internal
import LoginShapes from "./login-shapes";
import RegisterForm from "../forms/register-form";
import GoogleSignUp from "./google-sign-up";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const RegisterArea = () => {
  const { isSignedIn, user } = useUser();
  console.log({ isSignedIn, user });
  return (
    <>
      <section className="tp-login-area pb-140 p-relative z-index-1 fix">
        <LoginShapes />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-8">
              <div className="tp-login-wrapper">
                <div className="tp-login-top text-center mb-30">
                  <h3 className="tp-login-title">Sign Up Shofy.</h3>
                  <p>
                    Already have an account?{" "}
                    <span>
                      <Link href="/login">Sign In</Link>
                    </span>
                  </p>
                </div>
                <div className="tp-login-option">
                  <div className="tp-login-social mb-10 d-flex flex-wrap align-items-center justify-content-center">
                    <div className="tp-login-option-item has-google">
                      <SignedOut>
                        <SignInButton />
                        <SignUpButton>
                          <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                            Sign Up
                          </button>
                        </SignUpButton>
                      </SignedOut>
                      <SignedIn>
                        <UserButton />{" "}
                      </SignedIn>
                      <GoogleSignUp />
                    </div>
                  </div>
                  <div className="tp-login-mail text-center mb-40">
                    <p>
                      or Sign up with <a href="#">Email</a>
                    </p>
                  </div>
                  {/* form start */}
                  <RegisterForm />
                  {/* form end */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegisterArea;
