// src/hooks/useUserGuid.js
import { useState, useEffect } from "react";

// Convert Firebase UID to deterministic GUID format
export const firebaseUidToGuid = (uid) => {
    if (!uid) return null;
    
    let hash = 0;
    for (let i = 0; i < uid.length; i++) {
        hash = ((hash << 5) - hash) + uid.charCodeAt(i);
        hash = hash & hash;
    }
    
    const uid1 = uid.substring(0, 8).padEnd(8, '0');
    const uid2 = uid.substring(8, 12).padEnd(4, '0');
    const uid3 = uid.substring(12, 16).padEnd(4, '0');
    const uid4 = uid.substring(16, 20).padEnd(4, '0');
    const uid5 = uid.substring(20).padEnd(12, '0');
    
    const toHex = (str) => {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            result += str.charCodeAt(i).toString(16).padStart(2, '0');
        }
        return result;
    };
    
    const part1 = toHex(uid1).substring(0, 8);
    const part2 = toHex(uid2).substring(0, 4);
    const part3 = toHex(uid3).substring(0, 4);
    const part4 = toHex(uid4).substring(0, 4);
    const part5 = toHex(uid5).substring(0, 12);
    
    return `${part1}-${part2}-${part3}-${part4}-${part5}`;
};

function useUserGuid(user) {
  const [userGuid, setUserGuid] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      const guid = firebaseUidToGuid(user.uid);
      console.log("🔑 User GUID generated:", guid, "from Firebase UID:", user.uid);
      setUserGuid(guid);
    } else {
      console.log("🔑 No user, clearing GUID");
      setUserGuid(null);
    }
  }, [user?.uid]); // Only re-run when user.uid changes

  return userGuid;
}

export default useUserGuid;