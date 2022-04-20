<template>
	<div>
		<div>
			<h1>Create New Build</h1>
		</div>
		<form v-on:submit.prevent class="ui form segment">
			<div class="ui grid container">
				<div
					class="eight wide column field right label"
					:class="{ error: buildTitle == '' || buildTitle.length > 50 }"
				>
					<label>Title</label>
					<input type="text" v-model.trim="buildTitle" />
					<div class="field right label">{{ buildTitle.length }}/30</div>
				</div>
				<div
					class="eight wide column field right label"
					:class="{ error: buildBody == '' || buildBody.length > 130 }"
				>
					<label>Short Description</label>
					<input type="text" v-model.trim="buildBody" />
					<div>{{ buildBody.length }}/130</div>
				</div>
			</div>
			<div class="ui form three fields grid container">
				<div
					class="eight wide column field right label"
					:class="{ error: weaponClass == '' }"
				>
					<label>Weapon Class</label>
					<select
						class="ui fluid dropdown"
						v-model="weaponClass"
						@change="loadWeaponList()"
					>
						<option value="">Select Class</option>
						<option
							v-for="weaponClass in weaponMasterAdv"
							:value="weaponClass.value"
						>
							{{ weaponClass.name }}
						</option>
					</select>
				</div>
				<div
					class="eight wide column field right label"
					:class="{ error: weaponMain == '' }"
				>
					<label>Weapon</label>
					<select
						class="ui fluid dropdown"
						v-model="weaponMain"
						@change="loadAttachmentList()"
					>
						<option
							v-for="weapon in weaponListLoaded.list"
							:value="weapon.value"
						>
							{{ weapon.name }}
						</option>
					</select>
				</div>
				<!-- Attachment Dropdowns -->
			</div>
			<div class="ui form three fields grid container">
				<div
					class="five wide column field right label centered"
					v-for="attachmentClass in weaponAttachmentLoaded"
				>
					<label>{{ attachmentClass.name }}</label>
					<select
						class="ui fluid dropdown"
						:v-model="`weaponSlot${attachmentClass.index}`"
						@change="log(`weaponSlot${attachmentClass.index}`)"
					>
						<option
							@click="
								() => {
									delete weaponSlots[attachmentClass.name];
									rerenderFix++;
								}
							"
						>
							None Selected
						</option>
						<option
							v-for="attachment in attachmentClass.list"
							:value="attachment.value"
							:key="rerenderFix[attachmentClass.index]"
							@click="
								() => {
									weaponSlots[attachmentClass.name] = attachment.name;
									rerenderFix++;
								}
							"
						>
							<!-- <option
							v-for="attachment in attachmentClass.list"
							:key="attachment.value"
							:value="{ [attachment.value]: attachment.value }"
						> -->
							{{ attachment.name }}
						</option>
					</select>
				</div>
			</div>
			{{ $attrs.username }}
			<button class="ui primary submit button" @click="submitTicket()">
				Submit Ticket
			</button>
			<button class="ui clear button" @click="clearForm()">Clear</button>
		</form>
	</div>
</template>
<script>
import { db } from '../firebase';

export default {
	data: () => ({
		titleLimit: 30,
		bodyLimit: 130,
		rerenderFix: '',
		weaponClass: '',
		weaponMain: '',
		buildTitle: '',
		buildId: '',
		buildBody: '',
		submittedBy: '',
		favorites: 0,
		votes: 0,
		upvotes: 0,
		downvotes: 0,
		tags: [],
		weaponListLoaded: {},
		weaponAttachmentLoaded: {},
		weaponSlots: {},
		weaponMasterAdv: {},
		weaponMasterAdvOrig: [
			{
				name: 'Pistol',
				value: 'pistol',
				index: 0,
				list: [
					{ name: '.50 GS', value: 'p1' },
					{ name: '.357', value: 'p2' },
					{ name: 'AMP', value: 'p2' },
					{ name: 'CW 1911', value: 'p2' },
					{ name: 'CW Magnum', value: 'p2' },
					{ name: 'Diamatti', value: 'p2' },
					{ name: 'M19', value: 'p2' },
					{ name: 'MW 1911', value: 'p2' },
					{ name: 'Renetti', value: 'p2' },
					{ name: 'Sykov', value: 'p2' },
					{ name: 'X16', value: 'p2' },
				],
			},
			{
				name: 'Assault Rifle',
				value: 'assaultrifle',
				index: 1,
				list: [
					{
						name: 'AK-47 (CW)',
						value: 'ak74cw',
						game: 'cw',
						attachments: [
							{
								name: 'Muzzle',
								value: 'muzzle',
								index: 0,
								list: [
									{
										name: 'None',
										value: '',
										index: 0,
									},
									{ name: 'Muzzle Brake' },
									{ name: 'Flashguard' },
									{
										name: 'Suppressor',
										value: 'lightweightsuppressor',
										index: 1,
									},
									{ name: 'Spetsnaz Compensator' },
									{ name: 'KGB Eliminator' },

									{
										name: 'GRU Suppressor',
										value: 'monolithicsuppressor',
										index: 2,
									},
								],
							},
							{
								name: 'Barrel',
								value: 'barrel',
								index: 1,
								list: [
									{ name: 'None' },
									{ name: 'Ultralight' },
									{ name: 'Cavalry Lancer' },
									{ name: 'VDV Reinforced' },
									{ name: 'Liberator' },
									{ name: 'Takedown' },
									{ name: 'Spetsnaz RPK Barrel' },
								],
							},
							{
								name: 'Laser',
								value: 'laser',
								index: 2,
								list: [
									{ name: 'None' },
									{ name: 'Steady Aim Laser' },
									{ name: 'Mounted Flashlight' },
									{ name: 'KGB Target Designator' },
									{ name: 'GRU 5mW Laser Sight' },
									{ name: 'Tiger Team Spotlight' },
									{ name: 'Ember Sighting Point' },
								],
							},
							{
								name: 'Optic',
								value: 'optic',
								index: 3,
								list: [
									{ name: 'None' },
									{ name: 'Millstop Reflex (1x)' },
									{ name: 'Visiontech 2x (1.75x)' },
									{ name: 'Kobra Red Dot (1.25x)' },
									{ name: 'Quickdot LED (0.92x)' },
									{ name: 'Axial Arms (2.2x)' },
									{ name: 'Sillix Holoscout (1.25x)' },
									{ name: 'Microflex LED (0.92x)' },
									{ name: 'Hawksmoor (1x)' },
									{ name: 'Royal & Kross (3x)' },
									{ name: 'SUSAT Multizoom (1.7x + 3x)' },
									{ name: 'Diamondback Reflex (1x)' },
									{ name: 'Noch Sova Thermal (2.1x)' },
								],
							},
							{
								name: 'Stock',
								value: 'stock',
								list: [
									{ name: 'None' },
									{ name: 'Tactical Stock' },
									{ name: 'Wire Stock' },
									{ name: 'Duster Stock' },
									{ name: 'No Stock' },
									{ name: 'Spetsnaz PKM Stock' },
									{ name: 'KGB Skeletal Stock' },
								],
							},

							{
								name: 'Underbarrel',
								value: 'underbarrel',
								list: [
									{ name: 'None' },
									{ name: 'Foregrip' },
									{ name: 'Infiltrator Grip' },
									{ name: 'Patrol Grip' },
									{ name: 'Bruiser Grip' },
									{ name: 'Spetsnaz Grip' },
									{ name: 'Spetsnaz Speedgrip' },
								],
							},
							{
								name: 'Ammo',
								value: 'ammo',
								list: [
									{ name: 'None' },
									{ name: '45 Rnd' },
									{ name: 'Taped Mags' },
									{ name: '45 Rnd Speed Mag' },
									{ name: 'Bakelite 60 Rnd' },
									{ name: 'GRU Mag Clamp' },
									{ name: 'VDV 60 Rnd Fast Mag' },
								],
							},
							{
								name: 'Rear Grip',
								value: 'reargrip',
								list: [
									{ name: 'None' },
									{ name: 'Speed Tape' },
									{ name: 'Dropshot Wrap' },
									{ name: 'Field Tape' },
									{ name: 'Spetsnaz Field Grip' },
									{ name: 'Serpent Wrap' },
									{ name: 'GRU Elastic Wrap' },
								],
							},
						],
					},
					{ name: 'AK-47', value: 'ar2' },
					{ name: 'AN-94', value: 'ar1' },
					{ name: 'AS VAL', value: 'ar1' },
					{ name: 'AS44', value: 'ar1' },
					{ name: 'AUTOMATON', value: 'ar1' },
					{ name: 'BAR', value: 'ar1' },
					{ name: 'C58', value: 'ar1' },
					{ name: 'COOPER CARBINE', value: 'ar1' },
					{ name: 'CR-56 AMAX', value: 'ar1' },
					{ name: 'EM2', value: 'ar1' },
					{ name: 'FAL', value: 'ar1' },
					{ name: 'FARA', value: 'ar1' },
					{ name: 'FFAR', value: 'ar1' },
					{ name: 'FN Scar 17', value: 'ar1' },
					{ name: 'FR 5.56', value: 'ar1' },
					{ name: 'Grau 5.56', value: 'ar1' },
					{ name: 'Grav', value: 'ar1' },
					{ name: 'Groza', value: 'ar1' },
					{ name: 'ITRA BURST', value: 'ar1' },
					{ name: 'Kilo 141', value: 'ar1' },
					{ name: 'Krig 6', value: 'ar1' },
					{ name: 'M13', value: 'ar1' },
					{ name: 'M4A1', value: 'ar1' },
					{ name: 'NZ-41', value: 'ar1' },
					{ name: 'Oden', value: 'ar1' },
					{ name: 'QBZ', value: 'ar1' },
					{ name: 'RAM-7', value: 'ar1' },
					{ name: 'STG44', value: 'ar1' },
					{ name: 'VOLKSSTURMGEWEHR', value: 'ar1' },
					{ name: 'XM4', value: 'ar1' },
				],
			},
			{
				name: 'Light Machine Gun',
				value: 'lmg',
				index: 2,
				list: [
					{
						name: 'Bren',
						value: 'bren',
						game: 'vanguard',
						attachments: [
							{
								name: 'Muzzle',
								value: 'muzzle',
								index: 0,
								list: [
									{
										name: 'None',
										value: '',
										index: 0,
									},
									{ name: 'Muzzle Brake' },
									{ name: 'Flashguard' },
									{
										name: 'Suppressor',
										value: 'lightweightsuppressor',
										index: 1,
									},
									{ name: 'Spetsnaz Compensator' },
									{ name: 'KGB Eliminator' },

									{
										name: 'GRU Suppressor',
										value: 'monolithicsuppressor',
										index: 2,
									},
								],
							},
							{
								name: 'Barrel',
								value: 'barrel',
								index: 1,
								list: [
									{ name: 'None' },
									{ name: 'Ultralight' },
									{ name: 'Cavalry Lancer' },
									{ name: 'VDV Reinforced' },
									{ name: 'Liberator' },
									{ name: 'Takedown' },
									{ name: 'Spetsnaz RPK Barrel' },
								],
							},
							{
								name: 'Laser',
								value: 'laser',
								index: 2,
								list: [
									{ name: 'None' },
									{ name: 'Steady Aim Laser' },
									{ name: 'Mounted Flashlight' },
									{ name: 'KGB Target Designator' },
									{ name: 'GRU 5mW Laser Sight' },
									{ name: 'Tiger Team Spotlight' },
									{ name: 'Ember Sighting Point' },
								],
							},
							{
								name: 'Optic',
								value: 'optic',
								index: 3,
								list: [
									{ name: 'None' },
									{ name: 'Millstop Reflex (1x)' },
									{ name: 'Visiontech 2x (1.75x)' },
									{ name: 'Kobra Red Dot (1.25x)' },
									{ name: 'Quickdot LED (0.92x)' },
									{ name: 'Axial Arms (2.2x)' },
									{ name: 'Sillix Holoscout (1.25x)' },
									{ name: 'Microflex LED (0.92x)' },
									{ name: 'Hawksmoor (1x)' },
									{ name: 'Royal & Kross (3x)' },
									{ name: 'SUSAT Multizoom (1.7x + 3x)' },
									{ name: 'Diamondback Reflex (1x)' },
									{ name: 'Noch Sova Thermal (2.1x)' },
								],
							},
							{
								name: 'Stock',
								value: 'stock',
								list: [
									{ name: 'None' },
									{ name: 'Tactical Stock' },
									{ name: 'Wire Stock' },
									{ name: 'Duster Stock' },
									{ name: 'No Stock' },
									{ name: 'Spetsnaz PKM Stock' },
									{ name: 'KGB Skeletal Stock' },
								],
							},

							{
								name: 'Underbarrel',
								value: 'underbarrel',
								list: [
									{ name: 'None' },
									{ name: 'Foregrip' },
									{ name: 'Infiltrator Grip' },
									{ name: 'Patrol Grip' },
									{ name: 'Bruiser Grip' },
									{ name: 'Spetsnaz Grip' },
									{ name: 'Spetsnaz Speedgrip' },
								],
							},
							{
								name: 'Ammo',
								value: 'ammo',
								list: [
									{ name: 'None' },
									{ name: '45 Rnd' },
									{ name: 'Taped Mags' },
									{ name: '45 Rnd Speed Mag' },
									{ name: 'Bakelite 60 Rnd' },
									{ name: 'GRU Mag Clamp' },
									{ name: 'VDV 60 Rnd Fast Mag' },
								],
							},
							{
								name: 'Rear Grip',
								value: 'reargrip',
								list: [
									{ name: 'None' },
									{ name: 'Speed Tape' },
									{ name: 'Dropshot Wrap' },
									{ name: 'Field Tape' },
									{ name: 'Spetsnaz Field Grip' },
									{ name: 'Serpent Wrap' },
									{ name: 'GRU Elastic Wrap' },
								],
							},
						],
					},
					{ name: 'AK-47', value: 'ar2' },
					{ name: 'AN-94', value: 'ar1' },
					{ name: 'AS VAL', value: 'ar1' },
					{ name: 'AS44', value: 'ar1' },
					{ name: 'AUTOMATON', value: 'ar1' },
					{ name: 'BAR', value: 'ar1' },
					{ name: 'C58', value: 'ar1' },
					{ name: 'COOPER CARBINE', value: 'ar1' },
					{ name: 'CR-56 AMAX', value: 'ar1' },
					{ name: 'EM2', value: 'ar1' },
					{ name: 'FAL', value: 'ar1' },
					{ name: 'FARA', value: 'ar1' },
					{ name: 'FFAR', value: 'ar1' },
					{ name: 'FN Scar 17', value: 'ar1' },
					{ name: 'FR 5.56', value: 'ar1' },
					{ name: 'Grau 5.56', value: 'ar1' },
					{ name: 'Grav', value: 'ar1' },
					{ name: 'Groza', value: 'ar1' },
					{ name: 'ITRA BURST', value: 'ar1' },
					{ name: 'Kilo 141', value: 'ar1' },
					{ name: 'Krig 6', value: 'ar1' },
					{ name: 'M13', value: 'ar1' },
					{ name: 'M4A1', value: 'ar1' },
					{ name: 'NZ-41', value: 'ar1' },
					{ name: 'Oden', value: 'ar1' },
					{ name: 'QBZ', value: 'ar1' },
					{ name: 'RAM-7', value: 'ar1' },
					{ name: 'STG44', value: 'ar1' },
					{ name: 'VOLKSSTURMGEWEHR', value: 'ar1' },
					{ name: 'XM4', value: 'ar1' },
				],
			},
		],
	}),
	async mounted() {
		this.weaponMasterAdv = await import('../guns.json');
	},
	props: {
		userInfo: '',
	},
	watch: {},
	firestore: {},
	created: function () {
		this.buildId = this.generateBuildId();
	},
	methods: {
		loadWeaponList: function () {
			this.weaponListLoaded = this.weaponMasterAdv.find(
				(x) => x.value == this.weaponClass
			);
		},
		loadAttachmentList: function () {
			let weapon = this.weaponListLoaded.list.find(
				(x) => x.value == this.weaponMain
			);
			this.log(weapon);
			this.weaponAttachmentLoaded = weapon.attachments;
			// this.log(attachments);
			// this.weaponAttachmentLoaded = this.weaponListLoaded.find(
			// 	(x) => x.list == this.weaponClass
			// );
		},
		censorFilter: function (x) {
			let replacement = (word) => {
				let censored = '';
				for (const i of word) {
					censored = censored + '*';
				}
				return censored;
			};
			let restoreCap = (orig, clean) => {
				let final = '';
				for (let i = 0; i < orig.length; i++) {
					if (clean[i] != '*') {
						final = final + orig[i];
					} else {
						final = final + '*';
					}
				}
				return final;
			};
			const badWords = [
				'a$$',
				'4r5e',
				'5h1t',
				'5hit',
				'a55',
				'anal',
				'anus',
				'ar5e',
				'arrse',
				'arse',
				'ass',
				'ass-fucker',
				'asses',
				'assfucker',
				'assfukka',
				'asshole',
				'assholes',
				'asswhole',
				'a_s_s',
				'b!tch',
				'b00bs',
				'b17ch',
				'b1tch',
				'ballbag',
				'balls',
				'ballsack',
				'bastard',
				'beastial',
				'beastiality',
				'bellend',
				'bestial',
				'bestiality',
				'bi+ch',
				'biatch',
				'bitch',
				'bitcher',
				'bitchers',
				'bitches',
				'bitchin',
				'bitching',
				'bloody',
				'blow job',
				'blowjob',
				'blowjobs',
				'boiolas',
				'bollock',
				'bollok',
				'boner',
				'boob',
				'boobs',
				'booobs',
				'boooobs',
				'booooobs',
				'booooooobs',
				'breasts',
				'buceta',
				'bugger',
				'bum',
				'bunny fucker',
				'butt',
				'butthole',
				'buttmuch',
				'buttplug',
				'c0ck',
				'c0cksucker',
				'carpet muncher',
				'cawk',
				'chink',
				'cipa',
				'cl1t',
				'clit',
				'clitoris',
				'clits',
				'cnut',
				'cock',
				'cock-sucker',
				'cockface',
				'cockhead',
				'cockmunch',
				'cockmuncher',
				'cocks',
				'cocksuck',
				'cocksucked',
				'cocksucker',
				'cocksucking',
				'cocksucks',
				'cocksuka',
				'cocksukka',
				'cok',
				'cokmuncher',
				'coksucka',
				'coon',
				'cox',
				'crap',
				'cum',
				'cummer',
				'cumming',
				'cums',
				'cumshot',
				'cunilingus',
				'cunillingus',
				'cunnilingus',
				'cunt',
				'cuntlick',
				'cuntlicker',
				'cuntlicking',
				'cunts',
				'cyalis',
				'cyberfuc',
				'cyberfuck',
				'cyberfucked',
				'cyberfucker',
				'cyberfuckers',
				'cyberfucking',
				'd1ck',
				'damn',
				'dick',
				'dickhead',
				'dildo',
				'dildos',
				'dink',
				'dinks',
				'dirsa',
				'dlck',
				'dog-fucker',
				'doggin',
				'dogging',
				'donkeyribber',
				'doosh',
				'duche',
				'dyke',
				'ejaculate',
				'ejaculated',
				'ejaculates',
				'ejaculating',
				'ejaculatings',
				'ejaculation',
				'ejakulate',
				'f u c k',
				'f u c k e r',
				'f4nny',
				'fag',
				'fagging',
				'faggitt',
				'faggot',
				'faggs',
				'fagot',
				'fagots',
				'fags',
				'fanny',
				'fannyflaps',
				'fannyfucker',
				'fanyy',
				'fatass',
				'fcuk',
				'fcuker',
				'fcuking',
				'feck',
				'fecker',
				'felching',
				'fellate',
				'fellatio',
				'fingerfuck',
				'fingerfucked',
				'fingerfucker',
				'fingerfuckers',
				'fingerfucking',
				'fingerfucks',
				'fistfuck',
				'fistfucked',
				'fistfucker',
				'fistfuckers',
				'fistfucking',
				'fistfuckings',
				'fistfucks',
				'flange',
				'fook',
				'fooker',
				'fuck',
				'fucka',
				'fucked',
				'fucker',
				'fuckers',
				'fuckhead',
				'fuckheads',
				'fuckin',
				'fucking',
				'fuckings',
				'fuckingshitmotherfucker',
				'fuckme',
				'fucks',
				'fuckwhit',
				'fuckwit',
				'fudge packer',
				'fudgepacker',
				'fuk',
				'fuker',
				'fukker',
				'fukkin',
				'fuks',
				'fukwhit',
				'fukwit',
				'fux',
				'fux0r',
				'f_u_c_k',
				'gangbang',
				'gangbanged',
				'gangbangs',
				'gaylord',
				'gaysex',
				'goatse',
				'God',
				'god-dam',
				'god-damned',
				'goddamn',
				'goddamned',
				'hardcoresex',
				'hell',
				'heshe',
				'hoar',
				'hoare',
				'hoer',
				'homo',
				'hore',
				'horniest',
				'horny',
				'hotsex',
				'jack-off',
				'jackoff',
				'jap',
				'jerk-off',
				'jism',
				'jiz',
				'jizm',
				'jizz',
				'kawk',
				'knob',
				'knobead',
				'knobed',
				'knobend',
				'knobhead',
				'knobjocky',
				'knobjokey',
				'kock',
				'kondum',
				'kondums',
				'kum',
				'kummer',
				'kumming',
				'kums',
				'kunilingus',
				'l3i+ch',
				'l3itch',
				'labia',
				'lust',
				'lusting',
				'm0f0',
				'm0fo',
				'm45terbate',
				'ma5terb8',
				'ma5terbate',
				'masochist',
				'master-bate',
				'masterb8',
				'masterbat*',
				'masterbat3',
				'masterbate',
				'masterbation',
				'masterbations',
				'masturbate',
				'mo-fo',
				'mof0',
				'mofo',
				'mothafuck',
				'mothafucka',
				'mothafuckas',
				'mothafuckaz',
				'mothafucked',
				'mothafucker',
				'mothafuckers',
				'mothafuckin',
				'mothafucking',
				'mothafuckings',
				'mothafucks',
				'mother fucker',
				'motherfuck',
				'motherfucked',
				'motherfucker',
				'motherfuckers',
				'motherfuckin',
				'motherfucking',
				'motherfuckings',
				'motherfuckka',
				'motherfucks',
				'muff',
				'mutha',
				'muthafecker',
				'muthafuckker',
				'muther',
				'mutherfucker',
				'n1gga',
				'n1gger',
				'nazi',
				'nigg3r',
				'nigg4h',
				'nigga',
				'niggah',
				'niggas',
				'niggaz',
				'nigger',
				'niggers',
				'nob',
				'nob jokey',
				'nobhead',
				'nobjocky',
				'nobjokey',
				'numbnuts',
				'nutsack',
				'orgasim',
				'orgasims',
				'orgasm',
				'orgasms',
				'p0rn',
				'pawn',
				'pecker',
				'penis',
				'penisfucker',
				'phonesex',
				'phuck',
				'phuk',
				'phuked',
				'phuking',
				'phukked',
				'phukking',
				'phuks',
				'phuq',
				'pigfucker',
				'pimpis',
				'piss',
				'pissed',
				'pisser',
				'pissers',
				'pisses',
				'pissflaps',
				'pissin',
				'pissing',
				'pissoff',
				'poop',
				'porn',
				'porno',
				'pornography',
				'pornos',
				'prick',
				'pricks',
				'pron',
				'pube',
				'pusse',
				'pussi',
				'pussies',
				'pussy',
				'pussys',
				'rectum',
				'retard',
				'rimjaw',
				'rimming',
				's hit',
				's.o.b.',
				'sadist',
				'schlong',
				'screwing',
				'scroat',
				'scrote',
				'scrotum',
				'semen',
				'sex',
				'sh!+',
				'sh!t',
				'sh1t',
				'shag',
				'shagger',
				'shaggin',
				'shagging',
				'shemale',
				'shi+',
				'shit',
				'shitdick',
				'shite',
				'shited',
				'shitey',
				'shitfuck',
				'shitfull',
				'shithead',
				'shiting',
				'shitings',
				'shits',
				'shitted',
				'shitter',
				'shitters',
				'shitting',
				'shittings',
				'shitty',
				'skank',
				'slut',
				'sluts',
				'smegma',
				'smut',
				'snatch',
				'son-of-a-bitch',
				'spac',
				'spunk',
				's_h_i_t',
				't1tt1e5',
				't1tties',
				'teets',
				'teez',
				'testical',
				'testicle',
				'tit',
				'titfuck',
				'tits',
				'titt',
				'tittie5',
				'tittiefucker',
				'titties',
				'tittyfuck',
				'tittywank',
				'titwank',
				'tosser',
				'turd',
				'tw4t',
				'twat',
				'twathead',
				'twatty',
				'twunt',
				'twunter',
				'v14gra',
				'v1gra',
				'vagina',
				'viagra',
				'vulva',
				'w00se',
				'wang',
				'wank',
				'wanker',
				'wanky',
				'whoar',
				'whore',
				'willies',
				'willy',
				'xrated',
				'xxx',
			];
			// console.log(`Input=> ${x}`);
			let cleanX = x.toLowerCase();
			// let inputLower = x.lower();
			for (let i = 0; i < badWords.length; i++) {
				const badWord = badWords[i];
				let badCount = cleanX.split(badWord).length - 1;
				for (let j = 0; j < badCount; j++) {
					if (cleanX.includes(badWord)) {
						cleanX = cleanX.replace(badWord, replacement(badWord));
						// console.log(`Found ${badCount} bad word(s): ${badWord}`);
					}
				}

				// console.log(x.toLowerCase().includes(badWord));
			}
			// console.log(x);
			// console.log(cleanX);
			return restoreCap(x, cleanX);
		},
		loadAttachments: function (x, y) {
			this.weaponSlots[x] = y;
		},
		generateBuildId: function () {
			let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZ';
			let nums = '0123456789';
			let string_length = 5;
			let number_length = 5;
			let randomstring = '';
			let randomnumber = '';
			for (let i = 0; i < string_length; i++) {
				let rnum = Math.floor(Math.random() * chars.length);
				randomstring += chars.substring(rnum, rnum + 1);
			}
			for (let i = 0; i < number_length; i++) {
				let r = Math.floor(Math.random() * nums.length);
				randomnumber += nums.substring(r, r + 1);
			}
			return randomstring + randomnumber;
		},
		log(message) {
			console.log(message);
		},
		submitTicket() {
			if (
				this.weaponClass != '' &&
				this.weaponMain != '' &&
				(this.buildTitle != '' || this.buildTitle.length > this.titleLimit) &&
				(this.buildBody != '' || this.buildBody.length > this.bodyLimit) &&
				this.weaponSlots != {}
			) {
				db.collection(`builds`)
					.doc(this.buildId)
					.set({
						assignedTo: '',
						class: this.weaponClass,
						weapon: this.weaponMain,
						lastUpdate: Date.now(),
						title: this.censorFilter(this.buildTitle),
						attachments: this.weaponSlots,
						author: this.userInfo.username,
						buildId: this.buildId,
						buildBody: this.censorFilter(this.buildBody),
						timestamp: Date.now(),
						active: false,
						ghosted: false,
						upvotes: 1,
						downvotes: 0,
						favorites: [],
						votes: 1,
						tags: [],
					});
				this.$router.push('/buildsubmit/' + this.buildId);
			} else {
				// this.log(`Complete all red fields!`);
				alert(`Some text fields were left blank! Complete all red fields!`);
				// this.clearForm();
				// this.newFormFire = false;
			}
		},
		clearForm: function () {
			(this.issue1 = ''),
				(this.issue2 = ''),
				(this.planningPeriod = ''),
				(this.ticketTitle = ''),
				(this.ticketBody = ''),
				(this.submittedBy = '@NovaAcademy.org'),
				(this.location = ''),
				(this.room = '');
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
	margin-bottom: 3rem;
}
</style>
