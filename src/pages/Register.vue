<template>
	<div class="ui middle aligned center aligned grid">
		<div class="column">
			<h2 class="ui image header">
				<!-- <img src="assets/images/logo.png" class="image"> -->
				<div class="content">Register your WhatsMetaToday Account!</div>
			</h2>
			<form class="ui large form error">
				<div class="ui stacked segment">
					<div class="field">
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
					<div class="field">
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
					<div class="field">
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

					<div class="ui error message">
						<div class="header">{{ errorIn.message.toUpperCase() }}</div>
					</div>
					<div
						v-on:click="registerPasswordUser(email, username, password)"
						class="ui fluid large submit button"
					>
						Next Step >
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
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
// const auth = getAuth();

export default {
	name: 'register',
	data: function () {
		return {
			step: 1,
			username: '',
			email: '',
			password: '',
			uid: '',
			errorIn: { code: '', message: '' },
			error: '',
			success: '',
			errorClass: false,
			ready: false,
		};
	},
	methods: {
		usernameCheck: function () {},
		registerPasswordUser: function (email, displayName, password, photoURL) {
			var vm = this;
			var user = null;
			var outUid = null;
			//NULLIFY EMPTY ARGUMENTS
			for (var i = 0; i < arguments.length; i++) {
				arguments[i] = arguments[i] ? arguments[i] : null;
			}
			firebase
				.auth()
				.createUserWithEmailAndPassword(email, password)
				.then(function (userCredential) {
					user = userCredential.user;
					user.sendEmailVerification();
					// this.uid = user.uid;
				})
				.then(function () {
					user.updateProfile({
						displayName: displayName,
						// photoURL: photoURL,
					});
					console.log(user.uid);
					outUid = user.uid;
					// this.registerUid(user.uid);
				})
				.then(function () {
					db.collection(`users`).doc(outUid).set({
						username: displayName,
						uid: outUid,
						builds: [],
						favorites: [],
						twitch: '',
						youtube: '',
						facebookgg: '',
					});
				})
				.catch(function (error) {
					console.log(error.message, 7000);
					vm.errorIn = error;
				});
			vm.success = 'Validation link was sent to ' + email + '.';
		},
		log(x) {
			console.log(x);
		},
		reload() {
			location.reload();
		},
		registerUid(x) {
			db.collection(`users`).doc(x).set({
				uid: x,
				builds: [],
				favorites: [],
				twitch: '',
				youtube: '',
				facebookgg: '',
			});
		},
	},
};
</script>
<style scoped>
</style>