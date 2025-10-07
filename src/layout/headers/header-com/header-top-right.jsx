import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedOut } from "@/redux/features/auth/authSlice";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useLoginUserMutation } from "@/redux/features/auth/authApi";
import { notifySuccess } from "@/utils/toast";

// language
function Language({ active, handleActive }) {
  return (
    <div className="tp-header-top-menu-item tp-header-lang">
      <span
        onClick={() => handleActive("lang")}
        className="tp-header-lang-toggle"
        id="tp-header-lang-toggle"
      >
        English
      </span>
      <ul className={active === "lang" ? "tp-lang-list-open" : ""}>
        <li>
          <a href="#">Spanish</a>
        </li>
        <li>
          <a href="#">Russian</a>
        </li>
        <li>
          <a href="#">Portuguese</a>
        </li>
      </ul>
    </div>
  );
}

// currency
function Currency({ active, handleActive }) {
  return (
    <div className="tp-header-top-menu-item tp-header-currency">
      <span
        onClick={() => handleActive("currency")}
        className="tp-header-currency-toggle"
        id="tp-header-currency-toggle"
      >
        USD
      </span>
      <ul className={active === "currency" ? "tp-currency-list-open" : ""}>
        <li>
          <a href="#">EUR</a>
        </li>
        <li>
          <a href="#">CHF</a>
        </li>
        <li>
          <a href="#">GBP</a>
        </li>
        <li>
          <a href="#">KWD</a>
        </li>
      </ul>
    </div>
  );
}

// setting
function ProfileSetting({ active, handleActive }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [loginUser, {}] = useLoginUserMutation();
  const hasLoggedIn = useRef(false);
  // handle logout
  const handleLogout = () => {
    dispatch(userLoggedOut());
    router.push("/");
  };

  const { isSignedIn, user: clerkUser } = useUser();

  useEffect(() => {
    if (isSignedIn && clerkUser && !hasLoggedIn.current) {
      hasLoggedIn.current = true;
      let data = {
        organization_id: process.env.NEXT_PUBLIC_ORG_ID,
        cleark_id: clerkUser?.id,
        first_name: clerkUser?.firstName,
        last_name: clerkUser?.lastName,
        email: clerkUser?.emailAddresses?.[0]?.emailAddress,
      };

      loginUser(data).then((res) => {
        if (res?.data) {
          localStorage.setItem("access_token", res?.data?.token);
          // notifySuccess("Login successfully");
          // router.push(redirect || "/");
        } else {
          // notifyError(data?.error?.data?.error);
        }
      });
    }
  }, [isSignedIn, clerkUser?.id]);

  return (
    <div className="tp-header-top-menu-item tp-header-setting">
      <span
        onClick={() => handleActive("setting")}
        className="tp-header-setting-toggle"
        id="tp-header-setting-toggle"
      >
        Setting
      </span>
      <ul className={active === "setting" ? "tp-setting-list-open" : ""}>
        <li>
          <Link href="/profile">My Profile</Link>
        </li>
        <li>
          <Link href="/wishlist">Wishlist</Link>
        </li>
        <li>
          <Link href="/cart">Cart</Link>
        </li>
        <li>
          {!user?.name && (
            <SignedOut>
              {/* Sign In redirect */}
              <SignInButton>
                <button>Sign In</button>
              </SignInButton>
            </SignedOut>
          )}
          <SignedIn>
            <UserButton />
          </SignedIn>
          {user?.name && (
            <a onClick={handleLogout} className="cursor-pointer">
              Logout
            </a>
          )}
        </li>
      </ul>
    </div>
  );
}

const HeaderTopRight = () => {
  const [active, setIsActive] = useState("");
  // handle active
  const handleActive = (type) => {
    if (type === active) {
      setIsActive("");
    } else {
      setIsActive(type);
    }
  };
  return (
    <div className="tp-header-top-menu d-flex align-items-center justify-content-end">
      <Language active={active} handleActive={handleActive} />
      <Currency active={active} handleActive={handleActive} />
      <ProfileSetting active={active} handleActive={handleActive} />
    </div>
  );
};

export default HeaderTopRight;
