// file to handle emails
import nodemailer from 'nodemailer';

interface EmailOptions {
	from: string;
	to: string;
	subject: string;
	text: string;
}

export class Email {
	private _transporter = nodemailer.createTransport({
		service: 'gmail', // Use your email provider
		auth: {
			user: process.env.GMAIL_ADDRESS,
			pass: process.env.GMAIL_PASSWORD
		}
	});
	private readonly _myEmail: string = process.env.MY_EMAIL_ADDRESS;
	private _mailOptions: EmailOptions | undefined;

	constructor(subject: string, text: string, to?: string) {
		if (!this._transporter)
			throw new Error('Email transporter is not initialized');
		this._mailOptions = {
			from: this._myEmail,
			to: to ?? this._myEmail,
			subject,
			text
		};
	}

	async send() {
		if (!this._mailOptions)
			throw new Error('Email options are not initialized');
		try {
			await this._transporter.sendMail(this._mailOptions);
			console.log('Email sent successfully');
		} catch (error) {
			console.error('Error sending email:', error);
		}
	}
}
