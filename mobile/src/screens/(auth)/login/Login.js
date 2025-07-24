import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginSchema } from './loginSchema'; // Adjust the import path as necessary

export default function Login() {
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = (data) => {
        // Handle login logic here
        console.log('Email:', data.email);
        console.log('Password:', data.password);
    };

    const handleSignUp = () => {
        // Handle navigation to sign up screen
        console.log('Navigate to sign up');
    };

    return (
        <View className="flex-1 bg-gradient-to-br from-rose-50 to-red-50">
            {/* Background Decorative Elements */}
            <View className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full opacity-20 -translate-y-16 translate-x-16" />
            <View className="absolute bottom-20 left-0 w-24 h-24 bg-red-200 rounded-full opacity-30 -translate-x-12" />
            
            {/* Main Content */}
            <View className="flex-1 px-8 justify-center">
                {/* Header Section */}
                <View className="mb-16 items-center">
                    <Image 
                        source={require('../../../../assets/icon.png')} // Put your logo.png in assets folder
                        className="w-24 h-24 rounded-lg mb-10"
                        resizeMode="contain"
                    />
                    <Text className="text-4xl font-bold text-gray-900 mb-3">
                        Welcome Back
                    </Text>
                    <Text className="text-gray-500 text-lg">
                        Please sign in to continue
                    </Text>
                </View>

                {/* Login Card */}
                <View className="bg-white rounded-3xl p-8 shadow-xl shadow-red-100 border border-red-50">
                    {/* Email Input */}
                    <View className="mb-6">
                        <Text className="text-gray-700 mb-3 font-semibold text-base">
                            Email Address
                        </Text>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className={`bg-gray-50 rounded-2xl border-2 ${errors.email ? 'border-red-400' : 'border-gray-100'} focus-within:border-red-300`}>
                                    <TextInput
                                        className="px-5 py-4 text-gray-900 text-base"
                                        placeholder="your@email.com"
                                        placeholderTextColor="#9CA3AF"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                </View>
                            )}
                        />
                        {errors.email && (
                            <Text className="text-red-500 text-sm mt-2 ml-2">
                                {errors.email.message}
                            </Text>
                        )}
                    </View>

                    {/* Password Input */}
                    <View className="mb-8">
                        <Text className="text-gray-700 mb-3 font-semibold text-base">
                            Password
                        </Text>
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className={`bg-gray-50 rounded-2xl border-2 ${errors.password ? 'border-red-400' : 'border-gray-100'} focus-within:border-red-300`}>
                                    <TextInput
                                        className="px-5 py-4 text-gray-900 text-base"
                                        placeholder="Enter your password"
                                        placeholderTextColor="#9CA3AF"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        secureTextEntry={true}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                </View>
                            )}
                        />
                        {errors.password && (
                            <Text className="text-red-500 text-sm mt-2 ml-2">
                                {errors.password.message}
                            </Text>
                        )}
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity
                        className="bg-red-600 rounded-2xl py-5 shadow-lg shadow-red-200 active:scale-95"
                        onPress={handleSubmit(onSubmit)}
                        activeOpacity={0.9}
                    >
                        <Text className="text-white text-center font-bold text-lg">
                            Sign In
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Section */}
                <View className="mt-12 items-center">
                    <View className="flex-row items-center">
                        <Text className="text-gray-500 text-base">
                            Don't have an account?{' '}
                        </Text>
                        <TouchableOpacity 
                            onPress={handleSignUp}
                            className="bg-red-50 px-4 py-2 rounded-xl"
                        >
                            <Text className="text-red-600 font-bold text-base">
                                Create Account
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}