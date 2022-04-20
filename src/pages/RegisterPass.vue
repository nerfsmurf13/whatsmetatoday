<template>
	<div>
		<div>
			<h1>Account Created!</h1>
		</div>
		<div class="ui form success">
			<div class="ui success message">
				<div class="header">
					Your account has been created successfully! Click Here to Login!
				</div>
			</div>
		</div>
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

export default {
	data: () => ({}),
	watch: {},
	firestore: {},
	created: function () {},
	methods: {},
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
