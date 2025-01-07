import React, { useState, useEffect } from "react";
import AdminNavbar from "../Components/AdminNavbar";
import DeleteConfirmationModal from "./DeleteConfirm";
import axios from "axios";
import { setUserData } from "../redux/features/userSlice";
import {
  isEmpty,
  isPasswordValid,
  isEmailValid,
} from "../../helper/validation";
import { useSelector } from "react-redux";

export const AdminDash = () => {
  const [user, setUser] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editerr, setEditerr] = useState(false);
  const [editerrdef, setEditerrdef] = useState("");
  const [open, setOpen] = useState(false);

  const usersdata = useSelector((state) => state.user.userData);
  console.log("user data:@@@@@@", usersdata._id);

  const [editname, setEditname] = useState({
    name: "",
    id: "",
    value: "",
    user_id: usersdata._id,
  });
  const [error, setError] = useState({
    emailred: false,
    namered: false,
    passwordred: false,
    confirmpasswordred: false,
  });
  const [errordef, seterrordef] = useState({
    emailerr: "",
    nameerr: "",
    passworderr: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    Password: "",
  });
  const [deluser, setDelUser] = useState("");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [delid, setDelid] = useState(null);

  //add user modal
  const openAddModal = () => {
    setAddModalOpen(true);
  };
  const closeAddModal = () => {
    setNewUserData({
      name: "",
      email: "",
      Password: "",
    });
    setAddModalOpen(false);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
    console.log(newUserData);
  };

  const addUser = () => {
    let errors = {
      emailred: false,
      namered: false,
      passwordred: false,
      confirmpasswordred: false,
    };

    let errorMessages = {
      emailerr: "",
      nameerr: "",
      passworderr: "",
      confirmpassworderr: "",
    };

    if (isEmpty(newUserData.email)) {
      errors.emailred = true;
      errorMessages.emailerr = "Email can't be empty";
    } else if (isEmailValid(newUserData.email)) {
      errors.emailred = true;
      errorMessages.emailerr = "Enter a valid email";
    }

    // Validate name
    if (isEmpty(newUserData.name)) {
      errors.namered = true;
      errorMessages.nameerr = "Name can't be empty";
    }

    // Validate password
    if (isEmpty(newUserData.Password)) {
      errors.passwordred = true;
      errorMessages.passworderr = "Password can't be empty";
    } else if (isPasswordValid(newUserData.Password)) {
      errors.passwordred = true;
      errorMessages.passworderr = "Password is too weak";
    }
    setError(errors);
    seterrordef(errorMessages);

    if (!errors.emailred && !errors.namered && !errors.passwordred) {
      async function register() {
        try {
          await axios
            .post("http://localhost:5000/admin/adduser/", newUserData)
            .then((response) => {
              if (response.data.success) {
                closeAddModal();
                axios
                  .get("http://localhost:5000/admin/fetchusertoadmin")
                  .then((response) => {
                    const fetchedUsers = response.data.data;
                    const usersWithId = fetchedUsers.map((user, index) => ({
                      ...user,
                      id: index + 1,
                    }));

                    setUser(usersWithId);
                    setIsLoading(false);
                  })
                  .catch((err) => {
                    console.log(err);
                    setIsLoading(false);
                  });
              } else if (response.data.error) {
                setError((previous) => ({
                  ...previous,
                  emailred: true,
                }));
                seterrordef((previous) => ({
                  ...previous,
                  emailerr: response.data.error,
                }));
              }
            });
        } catch (error) {
          console.log(error);
        }
      }
      register();
    }
  };

  //edit modal
  const openEditModal = (id) => {
    const userToEdit = user.find((item) => item.id === id);
    setEditModalOpen(true);
    setEditname({
      name: userToEdit.name,
      id: userToEdit.id,
      value: "",
      user_id: userToEdit._id,
    });
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditname("");
  };

  const editvalue = (event) => {
    const value = event.target.value;
    setEditname((previous) => ({
      ...previous,
      value: value,
    }));
  };

  //delete modal
  const handleDelete = async (id) => {
    const userToDelete = user.find((item) => item.id === id);
    setDelUser(userToDelete.name);
    setDeleteModalOpen(true);
    setDelid(id);
  };
  const handleConfirmDelete = () => {
    console.log("Deleting user with ID:", delid);
    setDeleteModalOpen(false);
    deletecred(delid);
  };

  ///delete user
  const deletecred = (id) => {
    const userToDelete = user.find((item) => item.id == id);
    axios
      .delete("http://localhost:5000/admin/deleteuser", {
        data: { id: userToDelete._id },
      })
      .then(() => {
        axios
          .get("http://localhost:5000/admin/fetchusertoadmin")
          .then((response) => {
            const fetchedUsers = response.data.data;
            const usersWithId = fetchedUsers.map((user, index) => ({
              ...user,
              id: index + 1,
            }));

            setUser(usersWithId);
            setIsLoading(false);
            setDelUser("");
            setDeleteModalOpen(false);
            setDelid(null);
          })
          .catch((err) => {
            console.error("Error fetching users after deletion:", err);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  ///edit user
  const handleEdit = () => {
    let valid = true;
    console.log(editname, "!@#$%^&*(*&^%$#");
    if (isEmpty(editname.value)) {
      valid = false;
      setEditerr(true);
      setEditerrdef("field can't be empty");
    }

    if (valid) {
      setEditerr(false);
      setEditerrdef("");

      axios
        .post("http://localhost:5000/admin/edituser", editname)
        .then(() => {
          setOpen(false);
          axios
            .get("http://localhost:5000/admin/fetchusertoadmin")
            .then((response) => {
              const fetchedUsers = response.data.data;
              const usersWithId = fetchedUsers.map((user, index) => ({
                ...user,
                id: index + 1,
              }));

              setUser(usersWithId);
              setIsLoading(false);
              setEditname({
                name: "",
                id: "",
                value: "",
              });
              setEditModalOpen(false);
            })
            .catch((err) => {
              console.error("Error fetching users after deletion:", err);
              setIsLoading(false);
            });
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    }
  };
  const [search, setSearch] = useState("")
  useEffect(() => {
    axios
      .get(`http://localhost:5000/admin/fetchusertoadmin${search ? `?search=${search}` : ''}` )
      .then((response) => {
        const fetchedUsers = response.data.data;
        const usersWithId = fetchedUsers.map((user, index) => ({
          ...user,
          id: index + 1,
        }));

        setUser(usersWithId);
        setIsLoading(false);
      })
      
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
      
     
  //   const loadData = async () => {
  //     const res = await axios.get(
  //       "http://localhost:5000/admin/fetchusertoadmin"
  //     );
  //     if (res && res.data && res.data.data) {
  //       setUser(res.data.data);
  //     }
  //   };
  //   loadData();
  
  }, [search]);
  console.log("🚀 ~ .then ~ setUser:", user)
  return (
    <>
      <AdminNavbar
        users={user}
        setUser={setUser}
        setAddModalOpen={setAddModalOpen}
        setSearch={setSearch}
      />

      <div className="container mx-auto mt-8 p-2 max-w-2xl">
        <div className="flex justify-center items-center">
          <h2 className="text-3xl font-bold mb-4">User Details</h2>
        </div>
        <br></br>
        <br></br>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-200">
              {/* <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr> */}
            </thead>
            <tbody>
              {user.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{user.id}</td>
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => openEditModal(user.id)}
                      className="mr-2 px-2 py-1 bg-blue-500 text-white rounded-lg"
                    >
                      Edit User
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded-lg"
                    >
                      Delete User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="bg-white p-8 rounded-lg z-10 ">
            <h2 className="text-2xl font-bold mb-4">Edit User Name</h2>
            <label className="block mb-2">New Name:</label>
            <input
              type="text"
              value={editname.value}
              onChange={editvalue}
              className="border px-4 py-2 mb-4 mr-3"
            />
            {editerr && <p className="text-red-500 mb-2">{editerrdef}</p>}
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Save
            </button>
            <button
              onClick={closeEditModal}
              className="ml-2 px-4 py-2 bg-gray-400 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div
            className="bg-white p-8 rounded-lg z-10"
            style={{ width: "500px" }}
          >
            <h2 className="text-2xl font-bold mb-4">Add User</h2>

            <div className="mb-4">
              <label className="block mb-2">Name:</label>
              <input
                type="text"
                name="name"
                value={newUserData.name}
                onChange={handleAddChange}
                className={`border px-4 py-2 w-full ${
                  error.namered ? "border-red-500" : ""
                }`}
              />
              {error.namered && (
                <p className="text-red-500 mt-2">{errordef.nameerr}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2">Email:</label>
              <input
                type="email"
                name="email"
                value={newUserData.email}
                onChange={handleAddChange}
                className={`border px-4 py-2 w-full ${
                  error.emailred ? "border-red-500" : ""
                }`}
              />
              {error.emailred && (
                <p className="text-red-500 mt-2">{errordef.emailerr}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2">Password:</label>
              <input
                type="password"
                name="Password"
                value={newUserData.Password}
                onChange={handleAddChange}
                className={`border px-4 py-2 w-full ${
                  error.passwordred ? "border-red-500" : ""
                }`}
              />
              {error.passwordred && (
                <p className="text-red-500 mt-2">{errordef.passworderr}</p>
              )}
            </div>

            <div className="flex">
              <button
                onClick={addUser}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
              >
                Add User
              </button>
              <button
                onClick={closeAddModal}
                className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
