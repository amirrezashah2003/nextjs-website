import HeaderUp from "./HeaderUp"
import HeaderDown from "./HeaderDown"

import { cookies } from 'next/headers'
async function Header(){

  // ۱. خواندن کوکی در بخش سروری
  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get('token')

  let userPhone = null;
  let userId = null;

  if (tokenCookie) {
    try {
      // اگر از پکیج jsonwebtoken استفاده می‌کنید:
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(
        tokenCookie.value, 
        process.env.JWT_SECRET || 'super-secret-key'
      );
      userPhone = decoded.phone;
      userId = decoded.userId || decoded.id; 
    } catch (err) {
      userPhone = null;
    }
  }

    return(
    <header>
        <HeaderUp userPhone={userPhone} userId={userId} />
        <HeaderDown />
    </header>
    )
}
export default Header