<template>
	<div>
		<!-- <div>
			<h1>All Builds</h1>
		</div> -->
		<form v-on:submit.prevent class="ui huge form segment">
			<div class="field">
				<div class="field">
					<div class="field">
						<label>Search</label>
						<input type="text" v-on:keyup="fetchBuilds" v-model="buildQuery" />
					</div>
					<!-- <div class="field">
						<label>Game</label>
						<select @change="fetchBuilds" v-model="gameQuery">
							<option value="">All</option>
							<option value="0">MW2019</option>
							<option value="1">Cold War</option>
							<option value="2">Vanguard</option>
						</select>
					</div> -->
					<!-- <div class="field">
						<label>Class</label>
						<select @change="fetchBuilds" v-model="weaponClassQuery">
							<option value="">All</option>
							<option value="000">Assault Rifles</option>
							<option value="001">Light Machine Guns</option>
							<option value="002">Sub Machine Guns</option>
							<option value="003">Tactical Rifles</option>
							<option value="004">Markman Rifles</option>
							<option value="005">Sniper Rifles</option>
							<option value="006">Pistols</option>
						</select>
					</div> -->
				</div>
			</div>
		</form>
		<!-- <div class="ui hidden divider"></div> -->
		<!-- <div class="ui grid centered">
			<h2>{{ filteredBuilds.length }} Builds</h2>
		</div> -->
		<div class="ui three column cards doubling grid">
			<weapon-card
				v-for="build in filteredBuilds.slice().reverse()"
				:build="build"
				:userInfo="userInfo"
				:key="build.id"
			/>
		</div>
		<!-- <ol>
			<li v-for="build in sortedBuilds.slice().reverse()" :key="build.id">
				{{ timeConvert(build.timestamp) }}-{{ build.favorites }}-{{
					build.buildId
				}}
				- {{ build.buildBody }}
			</li>
		</ol> -->
	</div>
</template>
<script>
import { db } from '../firebase';
import weaponCard from '../components/weaponCard.vue';

// import * as admin from 'firebase-admin';

export default {
	components: { weaponCard },
	data: () => ({
		builds: [],
		username: '',
		masterBuilds: [],
		schoolCode: '',
		assetTag: '',
		entries: [],
		tipDevices: [],
		apData: [],
		students: [],
		ticketQuery: '',
		weaponClassQuery: '',
		gameQuery: '',
		allFilteredData1: [],
		finalFilteredData: [],
		buildQuery: '',
	}),
	props: {
		userInfo: '',
	},
	// watch: {
	// 	currentPage: 'fetchData',
	// 	currentPage: 'fetchTipData',
	// 	currentPage: 'fetchStudentData',
	// },
	firestore: {
		builds: db.collection(`builds`).orderBy('favorites'),
	},

	mounted: function () {
		this.fetchBuilds();
	},
	methods: {
		fetchBuilds() {
			this.masterBuilds = this.builds; //Initial 'all' ticket population that will be used for filtering
			let youShallNotPass = (build) => {
				if (this.buildQuery.includes(build)) {
					this.log('got a match');
				}
			};
		},
		filterStatus() {
			if (this.statusQuery) {
				this.filterRocket = rocketId;
			}
		},
		upvote(weaponId) {
			if (this.statusQuery) {
				this.filterRocket = rocketId;
			}
		},
		log(message) {
			console.log(message);
		},
		// deleteDevice: function (ticket) {
		// 	if (confirm(`Are you sure you want to remove ${ticket.ticketTitle}?`)) {
		// 		db.collection(`tickets`).doc(ticket.id).delete();
		// 	}
		// },
		clearForm: function () {
			(this.studentQuery = ''), (this.assetTag = '');
		},
		makeActive: function (student) {
			this.studentQuery = student.gsx$id.$t;
			// this.log(student.gsx$id.$t);
		},
		timeConvertFull(a) {
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
			let convdataTime = `${month} ${day}, ${year}`;
			return convdataTime;
		},
		statusConverter(x) {
			switch (x) {
				case '0':
					return 'Open';
				case '1':
					return 'Pending';
				case '2':
					return 'Resolved';
				default:
					break;
			}
		},
	},
	computed: {
		sortedBuilds: function () {
			//Can change favorite/rankSensitivity by adding 0's (more sensitive to favs, less time) or removing 0's (more sensitive to time, less favs) 450000 is default for now
			let rankSensitivity = 450000;
			return this.masterBuilds.sort((a, b) => {
				if (
					Math.round(
						Math.log(Math.max(a.favorites, 1), 10) +
							(a.timestamp - 1134028003) / rankSensitivity
					) <
					Math.round(
						Math.log(Math.max(b.favorites, 1), 10) +
							(b.timestamp - 1134028003) / rankSensitivity
					)
				) {
					return -1;
				}
				if (
					Math.round(
						Math.log(Math.max(a.favorites, 1), 10) +
							(a.timestamp - 1134028003) / rankSensitivity
					) >
					Math.round(
						Math.log(Math.max(b.favorites, 1), 10) +
							(b.timestamp - 1134028003) / rankSensitivity
					)
				) {
					return 1;
				}
				// a must be equal to b
				return 0;
			});
		},
		filteredBuilds: function () {
			return this.sortedBuilds.filter((build) => {
				return (
					build.title.toLowerCase().includes(this.buildQuery.toLowerCase()) ||
					build.author.toLowerCase().indexOf(this.buildQuery.toLowerCase()) >= 0
				);
			});
		},
	},
};
</script>
<style>
.custom-margin-top {
	margin-top: 1rem;
}
.custom-margin-bottom {
	margin-bottom: 3rem;
}

.image {
	/* background: black !important; */
	background: white !important;
}
</style>
