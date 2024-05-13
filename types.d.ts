export enum AttachmentType {
	Image = 0,
	Video,
	Audio
}

type PostProps = {
	id: number,
	createdAt: Date,
	content: string,
	attachment: AttachmentProps
}

type PostPreviewProps = {
	board: string
} & PostProps

type BoardParams = {
	params: {
		board: string
	}
}

type ThreadParams = {
	params: {
		thread: string
	}
}

type AttachmentProps = {
	name: string,
	attachmentTypeId: number
}