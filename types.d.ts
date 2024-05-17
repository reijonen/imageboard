export enum AttachmentType {
	Image = 0,
	Video,
	Audio
}

type PostProps = {
	id: number,
	createdAt: Date,
	content: string,
	replyCount: number | null,
	imageCount: number | null,
	attachment: AttachmentProps,
	replies: PostProps[];
};

type ThreadPreviewProps = {
	board: string;
} & PostProps;

type BoardParams = {
	params: {
		board: string;
	};
};

type ThreadParams = {
	params: {
		board: string;
		thread: string;
	};
};

type AttachmentProps = {
	name: string,
	attachmentTypeId: number;
};

type PostFormProps = {
	board: string,
	threadId: number;
};

interface ErrorDetail {
	code: string;
	expected: string;
	received: string;
	path: string[];
	message: string;
}