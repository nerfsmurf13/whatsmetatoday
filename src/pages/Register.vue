<template>
	<div class="ui middle aligned center aligned grid">
		<div class="column">
			<h2 class="ui image header">
				<!-- <img src="assets/images/logo.png" class="image"> -->
				<div class="content">Register your WhatsMetaToday Account!</div>
			</h2>
			<form class="ui large form error">
				<div class="ui stacked segment">
					<div v-show="step == 1" class="field">
						<div class="ui left icon input">
							<i class="envelope icon"></i>
							<input
								type="text"
								name="email"
								placeholder="E-mail"
								v-model="email"
							/>
						</div>
					</div>
					<div v-show="step == 1" class="field">
						<div class="ui left icon input">
							<i class="lock icon"></i>
							<input
								type="password"
								name="password"
								placeholder="Password"
								v-model="password"
							/>
						</div>
					</div>
					<div v-show="step == 2" class="field">
						<div class="ui left icon input">
							<i class="user icon"></i>
							<input
								type="text"
								name="username"
								placeholder="Username"
								v-model="username"
							/>
						</div>
					</div>
					<div v-show="step == 3" class="field">
						<div class="ui left icon input">
							<p>
								Account Created!
								<div @click="()=>{reload()}"><a href="#">Click Here</a></div>
								to get started!
							</p>
						</div>
					</div>
					<div class="ui error message">
						<div class="header">{{ errorIn.message.toUpperCase() }}</div>
					</div>
					<div
						v-show="step == 1"
						v-on:click="register()"
						class="ui fluid large submit button"
					>
						Next Step >
					</div>
					<div
						v-show="step == 2"
						v-on:click="checkUsername()"
						class="ui fluid large submit button"
					>
						Register
					</div>
				</div>
			</form>
		</div>
	</div>
</template>
<script>
// import { db } from '../firebase';
import firebase from 'firebase';
import { db } from '../firebase';

export default {
	name: 'register',
	data: function () {
		return {
			step: 1,
			username: '',
			email: '',
			password: '',
			errorIn: { code: '', message: '' },
			errorClass: false,
			ready: false,
		};
	},
	methods: {
		register: function (e) {
			// this.step = 2;
			firebase
				.auth()
				.createUserWithEmailAndPassword(this.email.toLowerCase(), this.password)
				.catch((error) => {
					// step = 1;
					// Handle Errors here.

					var errorCode = error.code;
					var errorMessage = error.message;
					this.errorIn.code = error.code;
					this.errorIn.message = error.message;
					if (errorCode == 'auth/weak-password') {
						alert('The password is too weak.');
					} else {
						alert(errorMessage);
					}
					console.log(error);
				})
				.finally(() => {
					if (!this.errorIn.code) {
						this.step = 2;
						this.log('Successfully Registered Email/Password, now username');
					}

					// console.log('Experiment completed');
				});

			// this.registerUsername();
		},
		checkUsername() {
			const usersRef = db
				.collection('users')
				.where('username', '==', this.username.toLowerCase());
			const newUsersRef = db
				.collection('users')
				.doc(this.email.toLowerCase().trim());

			usersRef.get().then((snapshot) => {
				this.log(snapshot.docs);
				if (snapshot.docs.length > 0) {
					this.log('Username Exists');
				} else {
					this.log('Username Unused');
					newUsersRef.set({
						username: this.username.toLowerCase(),
						builds: [],
						favorites: [],
						twitch: '',
						youtube: '',
						facebookgg: '',
					});
					// .then(location.reload()); // create the document
					this.step = 3;
					// this.register();
				}
			});
		},
		log(x) {
			console.log(x);
		},
		reload() {
			location.reload();
		},
		// registerUsername() {
		// 	db.collection(`users`).doc(this.email.toLowerCase().trim()).set({
		// 		username: this.username,
		// 		builds: [],
		// 		favorites: [],
		// 		twitch: '',
		// 		youtube: '',
		// 		facebookgg: '',
		// 	});
		// },
	},
};
</script>
<style scoped>
</style>