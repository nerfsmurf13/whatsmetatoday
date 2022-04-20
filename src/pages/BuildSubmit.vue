<template>
	<div>
		<div>
			<h1>Build Submitted!</h1>
		</div>
		<div class="ui form success">
			<div class="ui success message">
				<div class="header">Your build has been submitted!</div>
			</div>
		</div>
		<form v-on:submit.prevent class="ui form segment">
			<div class="field">
				<div class="field">
					<label>Build Title</label>
					<!-- <input type="text" v-model="ticketData.ticketTitle" /> -->
					<div>{{ buildData.buildTitle }}</div>
				</div>
				<div class="four fields">
					<div class="field ui">
						<label>ID</label>
						<div>{{ ticketData.ticketId }}</div>
					</div>
					<div class="field ui">
						<label>User</label>
						<div>{{ ticketData.submittedBy }}</div>
					</div>
					<div class="field">
						<label>Campus</label>
						<div>{{ ticketData.location }}</div>
					</div>
					<div class="field">
						<label>Room</label>
						<div>{{ ticketData.room }}</div>
					</div>
				</div>
				<div class="four fields">
					<div class="field ui">
						<label>Status</label>
						<div>{{ ticketData.status }}</div>
					</div>
					<div class="field">
						<label>Off Period</label>
						<div>{{ ticketData.planningPeriod }}</div>
					</div>
					<div class="field ui">
						<label>Time Submitted</label>
						<div>{{ timeConvert(ticketData.timestamp) }}</div>
					</div>
					<div class="field ui">
						<label>Last Update</label>
						<div>{{ timeConvert(ticketData.lastUpdate) }}</div>
					</div>
				</div>
			</div>

			<button class="ui submit button" @click="submitAnotherTicket()">
				Create Another Ticket
			</button>
		</form>
	</div>
</template>
<script>
// Ticket Info
// ticketTitle = Ticket Title/Subject
// ticketBody = Ticket Info
// ticketResolution = Text on how you fixed issue
// submittedBy = Who submitted ticket by email
// location = where is the issue
// room = room location
// timestamp = timestamp
// lastUpdate = timestamp when status changed
// ticketId = ticketId
// status = 0-open | 1-in progress | 2-closed

import { db } from '../firebase';

export default {
	data: () => ({
		tickets: [],
		// naaman_devices: [],
		// memorial_devices: [],
		buildData: {},
		ticketTitle: '',
		ticketBody: '',
		ticketResolution: '',
		submittedBy: 'nouser@fake.com',
		location: '',
		room: '',
		buildId: '',
		lastUpdate: '',
		status: 0,
		entries: [],
		tipDevices: [],
		apData: [],
		students: [],
		studentQuery: '',
		ticketData: [],
		ticketsRef: [],
	}),
	watch: {
		currentPage: 'fetchData',
		currentPage: 'fetchTipData',
		currentPage: 'fetchStudentData',
	},
	firestore: {
		ticketsRef: db.collection(`builds`),
		// naaman_devices: db.collection(`naaman_devices`).orderBy('timestamp'),
		// memorial_devices: db.collection(`memorial_devices`).orderBy('timestamp'),
		// .doc('naaman')
		//
	},
	created: function () {
		this.buildId = this.$route.params.id;
		// this.ticketData = this.ticketsRef.where('ticketId', '==', this.ticketId);
		this.getBuild();
	},
	methods: {
		getBuild: function () {
			db.collection(`builds`)
				.where('buildId', '==', this.buildId)
				.get()
				.then((querySnapshot) => {
					// this.ticketData = querySnapshot;
					querySnapshot.forEach((doc) => {
						// doc.data() is never undefined for query doc snapshots
						this.buildData = doc.data();
						// console.log(doc.id, ' => ', doc.data());
					});
				})
				.catch((error) => {
					console.log('Error getting documents: ', error);
				});
		},
		log(message) {
			console.log(message);
		},
		deleteDevice: function (device) {
			if (confirm(`Are you sure you want to remove ${device.rfId}?`)) {
				db.collection(`tickets`).doc(device.id).delete();
			}
		},
		submitAnotherTicket() {
			this.$router.push('/');
		},
		submitDevice() {
			if (this.schoolCode != '') {
				db.collection(`builds`).add({
					assignedTo: '',
					class: this.weaponClass,
					weapon: this.weaponMain,
					lastUpdate: Date.now(),
					title: this.buildTitle,
					attachments: this.weaponSlots,
					author: this.userInfo.username,
					buildId: this.buildId,
					buildBody: this.buildBody,
					timestamp: Date.now(),
					active: false,
					ghosted: false,
					upvotes: 1,
					downvotes: 0,
					favorites: 0,
					votes: 1,
					tags: [],
				});
				this.log('Added');
				this.assetTag = '';
				this.studentQuery = '';
				// this.studentId = '';
				// this.box = '';
				this.$router.go({ path: alltickets });
			} else {
				this.log(`Fail! Please try again!`);
				this.clearForm();
				// this.newFormFire = false;
			}
		},
		clearForm: function () {
			(this.studentQuery = ''), (this.assetTag = '');
		},
		makeActive: function (student) {
			this.studentQuery = student.gsx$id.$t;
			// this.log(student.gsx$id.$t);
		},
		timeConvert(a) {
			// Unixtimestamp
			let unixtimestamp = a;
			// Months array
			let months_arr = [
				'Jan',
				'Feb',
				'Mar',
				'Apr',
				'May',
				'Jun',
				'Jul',
				'Aug',
				'Sep',
				'Oct',
				'Nov',
				'Dec',
			];
			// Convert timestamp to milliseconds
			let date = new Date(unixtimestamp);
			// Year
			let year = date.getFullYear();
			// Month
			let month = months_arr[date.getMonth()];
			// Day
			let day = date.getDate();
			// Hours
			let hours = date.getHours();
			// Minutes
			let mins = date.getMinutes();
			let minutes = '';
			if (mins < 10) {
				minutes = '0' + mins;
			} else {
				minutes = mins;
			}
			// Seconds
			let secs = date.getSeconds();
			let seconds = '';
			if (secs < 10) {
				seconds = '0' + secs;
			} else {
				seconds = secs;
			}
			// Display date time in MM-dd-yyyy h:m:s format
			// let convdataTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
			let convdataTime = `${month} ${day}, ${year} @ ${hours}:${minutes}:${seconds}`;
			return convdataTime;
		},
	},
	computed: {},
};
</script>
<style>
.custom-margin-top {
	margin-top: 1rem;
}
.custom-margin-bottom {
	margin-bottom: 2rem;
}
</style>
