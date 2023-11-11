import React, { useState, ChangeEvent } from "react";

function PasswordInput({ change }: any) {
  const [isShown, setIsShown] = useState(false);

  return (
    <div className="password-cont">
      <input
        type={isShown ? "text" : "password"}
        name="password"
        id="password"
        onChange={change}
      />
      <img src={`../images/${isShown? "hide.png" : "show.png"}`} alt="hide-show" className="show-hide-img" onClick={() => setIsShown(!isShown)} />
    </div>
  );
}

export default PasswordInput;
