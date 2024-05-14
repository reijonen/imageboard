import crypto from "crypto"
import fs from "fs"

const hashFile = (path: string) => {
	const sum = crypto.createHash("sha256");
	sum.update(fs.readFileSync(path));
	return sum.digest("hex")
}

export default hashFile