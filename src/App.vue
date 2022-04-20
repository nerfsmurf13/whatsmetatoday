<template>
	<div id="app">
		<div class="ui secondary pointing huge menu">
			<div class="ui container">
				<router-link to="/" class="item header"> WhatsMetaToday </router-link>
				<router-link to="/newBuild" class="item">
					<i class="plus icon"></i> Submit a Build
				</router-link>
				<div class="right menu">
					<li v-if="isLoggedIn" class="item">
						{{ groupedProps.username }} | {{ currentUser }}
					</li>
					<router-link v-if="!isLoggedIn" to="/register" class="item">
						<i class="edit layout icon"></i> Register
					</router-link>
					<router-link v-if="!isLoggedIn" to="/login" class="item">
						<i class="key layout icon"></i> Login
					</router-link>
					<a v-if="isLoggedIn" v-on:click="logout" class="ui item">Logout</a>
				</div>
			</div>
		</div>
		<div class="ui container">
			<div class="ui message">
				<div class="header">This site is in beta!</div>
				<p>Please hang tight as we work on this project!</p>
			</div>
			<!-- <img src="./assets/logo.png" /> -->

			<router-view :userInfo="groupedProps" />
		</div>
	</div>
</template>

<script>
import firebase from 'firebase';
import { db } from './firebase';

export default {
	name: 'App',
	components: {},
	data() {
		return {
			isLoggedIn: false,
			currentUser: false,
			currentUsername: false,
			groupedProps: { username: '', favorites: [], uid: '' },
			username: false,
			favorites: [],
		};
	},
	created() {
		if (firebase.auth().currentUser) {
			this.isLoggedIn = true;
			this.currentUser = firebase.auth().currentUser.email;
			this.groupedProps.uid = this.currentUser;
		}
		// this.$root.$emit('eventing', data);
	},
	mounted() {
		this.getUsername();
	},
	methods: {
		logout: function () {
			firebase
				.auth()
				.signOut()
				.then(() => {
					this.$router.go({ path: this.$router.path });
				});
		},
		getUsername: function () {
			if (this.isLoggedIn) {
				db.collection(`users`)
					.doc(this.currentUser)
					.get()
					.then((snapshot) => {
						// this.log(snapshot.data().username);
						this.groupedProps.username = snapshot.data().username;
					})
					.catch((error) => {
						this.log(error);
					});
			}
		},
		log(message) {
			console.log(message);
		},
	},
};
</script>

<style>
#app {
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}

label {
	margin: 1rem!;
}

.mp {
	margin-bottom: 1rem;
	margin-top: 0.5rem;
}
</style>
