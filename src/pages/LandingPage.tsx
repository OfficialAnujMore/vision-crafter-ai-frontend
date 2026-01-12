import CustomInput from '../components/CustomInput'

const LandingPage = () => {
  return (
    <div>
<CustomInput
  label="Password"
  placeholder="Enter password"
  value={"password"}
  disabled={false}
  isSecure
  // onChange={setPassword}
/>

<CustomInput
  label="Email"
  placeholder="you@example.com"
  value={"email"}
  disabled={false}
  // onChange={setEmail}
/>
    </div>
  )
}

export default LandingPage