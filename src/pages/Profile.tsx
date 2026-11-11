import { useAuth } from "../context/usuarioContext"

function Profile() {
  const {user} = useAuth();
  return (
    <div>
      <p>Hola {user?.nickName}</p>
    </div>
  )
}

export default Profile
