<template>
	<div class="column">
		<div class="ui fluid card">
			<div class="content">
				<div class="right floated meta">{{ timeConvert(build.timestamp) }}</div>
				<div class="header">{{ build.title }}</div>
				<!-- <div class="header">{{ build.title }} {{ build.id }}</div> -->
			</div>
			<div class="image custom-dark">
				<img
					class="tiktok-fx"
					:src="require(`../assets/image_${build.weapon}.png`)"
				/>
			</div>
			<div class="content">
				<div class="meta">
					<a> {{ build.buildBody }} </a>
				</div>
				<div class="description">
					<div v-for="(value, key) in build.attachments">
						{{ key }}: {{ value }}
					</div>

					<!-- {{ build.attachments }} -->
				</div>
			</div>
			<div class="extra content">
				<span class="right floated">{{ build.author }}</span>
				<!-- <span>
					<i class="arrow circle up icon"></i>
					{{ build.upvotes }}
				</span>
				|
				<span>
					<i class="arrow circle down icon"></i>
					{{ build.downvotes }}
				</span>
				| -->
				<span>
					<!-- <i class="star outline icon" @click="favorite(build.id)"></i> -->
					<i v-show="!faved" class="star outline icon" @click="favorite()"></i
					><i v-show="faved" class="star icon" @click="favorite()"></i>
					{{ favs }}
				</span>
			</div>
		</div>
	</div>
</template>

<script>
import { db } from '../firebase';
export default {
	name: 'weaponCard',
	data() {
		return {
			favs: '',
			faved: false,
			imageUrl: '',
		};
	},
	props: {
		build: {},
		userInfo: {},
	},
	mounted() {
		let count = 0;
		db.collection(`users`)
			.where('favorites', 'array-contains', this.build.id)
			.get()
			.then((snapshot) => {
				if (snapshot.docs.length > 0) {
					snapshot.docs.forEach((doc) => {
						// doc is a DocumentSnapshot with actual data
						const data = doc.data();
						// this.log(data);
						if (
							data.favorites.indexOf(this.build.id) &&
							data.username == this.userInfo.username
						) {
							this.faved = true;
							// this.log(this.build.id);
						} else {
							this.faved = false;
						}
					});
				}

				// this.log(snapshot.docs.length);
				count = snapshot.docs.length;
			});
		setTimeout(() => {
			this.favs = count;
		}, 1000);
	},
	methods: {
		// readFavoriteCounters() {
		// 	let count = 0;
		// 	db.collection(`users`)
		// 		.where('favorites', 'array-contains', this.build.id)
		// 		.get()
		// 		.then((snapshot) => {
		// 			count = snapshot.docs.length;
		// 			this.log(count);
		// 			this.favs = count;
		// 			return count;
		// 		});

		// },
		favorite() {
			// this.log(this.userInfo.username);
			db.collection(`users`)
				.where('username', '==', this.userInfo.username)
				.get()
				.then((snapshot) => {
					if (snapshot.docs.length > 0) {
						snapshot.docs.forEach((doc) => {
							// doc is a DocumentSnapshot with actual data
							const data = doc.data();
							// this.log(data.favorites);
							if (data.favorites.includes(this.build.id)) {
								//remove script
								let tempFavs = data.favorites;
								let remove = tempFavs.indexOf(this.build.id);
								this.log(tempFavs);
								tempFavs.splice(remove, 1);
								this.log(tempFavs);
								db.collection(`users`)
									.doc(this.userInfo.uid)
									.update({ favorites: tempFavs })
									.catch((error) => {
										this.log(error);
									});
								this.favs--;
								this.faved = false;
								db.collection(`builds`)
									.doc(this.build.id)
									.update({ favorites: this.favs })
									.catch((error) => {
										this.log(error);
									});
							} else {
								//add favorite
								let tempFavs = data.favorites;
								this.log(tempFavs);
								tempFavs.push(this.build.id);
								db.collection(`users`)
									.doc(this.userInfo.uid)
									.update({ favorites: tempFavs })
									.catch((error) => {
										this.log(error);
									});

								this.favs++;
								this.faved = true;
								db.collection(`builds`)
									.doc(this.build.id)
									.update({ favorites: this.favs })
									.catch((error) => {
										this.log(error);
									});
							}
						});
					} else {
						// decide what you want to do if there are no documents returned from the query
					}
				})
				.catch((error) => {
					this.log(error);
				});
			// 	this.log(snapshot.data())
			// 	// this.username = { username: snapshot.data().username };
			// }),
			// db.collection(`users`)
			// 	.doc(this.userInfo.username)
			// 	.set({ favorites: favorites.pop(weaponId) });
		},
		log(message) {
			console.log(message);
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
			let convdataTime = `${month} ${day}`;
			return convdataTime;
		},
		timeConvertLong(a) {
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
			let convdataTime = `${month} ${day} ${year} @ ${hours}:${minutes}:${seconds}`;
			return convdataTime;
		},
	},
	computed: {
		// readFavoriteCounters() {
		// 	let count = 0;
		// 	db.collection(`users`)
		// 		.where('favorites', 'array-contains', build.id)
		// 		.get()
		// 		.then((snapshot) => {
		// 			count = snapshot.docs.length;
		// 		});
		// 	return count;
		// },
	},
};
</script>

<style>
.custom-dark {
	background-color: black !important ;
}

.tiktok-fx {
	color: #111111;
	filter: invert(100%) sepia(66%) saturate(0%) hue-rotate(194deg)
		brightness(107%) contrast(999%) drop-shadow(2px 2px 0px #fd3e3e)
		drop-shadow(-2px -2px 0px #4de8f4);
	/* filter: drop-shadow(2px 0px 0px #fd3e3e) drop-shadow(-2px -2px 0px #4de8f4); */
}
</style>
