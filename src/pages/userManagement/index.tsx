import Taro from "@tarojs/taro";
import { OsList } from "ossaui";
import { useEffect, useState } from "react";

const UserManagement = () => {
  const [userList, setUserList] = useState<any[]>([]);

  useEffect(() => {
    Taro.request({
      url: "http://localhost:8080/user/get",
      method: "GET",
      success: (res) => {
        if (res.statusCode == 200) {
          setUserList(res.data);
        }
      },
    });
  }, []);

  return (
    <>
      {userList.length > 0 ? (
        <>
          {userList.map((item) => {
            return (
              <>
                <OsList
                  title={item.name}
                  desc={
                    item.role == 0 ? "学生" : item.role == 1 ? "教师" : "管理员"
                  }
                ></OsList>
              </>
            );
          })}
        </>
      ) : null}
    </>
  );
};

export default UserManagement;
