import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../constants/colors';
import FeedNav from '../../Components/Common/FeedNav';
import FeedJoinNav from '../../Components/Common/FeedJoinNav';
import FeedItem from '../../Components/Challenge/FeedItem';
import {
  FeedType,
  getFeed,
  postJoinChallenge,
  postOutChallenge,
} from '../../api/challenge-api';
import CustomText from '../../Components/Common/CustomText';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {getEncryptStorage} from '../../util';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigate/StackNavigate';

const ChallengeFeedPage = ({
  route,
}: {
  route: RouteProp<RootStackParamList, 'challenge_feed'>;
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {id, title, type} = route.params;
  const [isType, setIsType] = useState(type);
  const [feeds, setFeeds] = useState<FeedType[] | []>([]);

  const handleWrite = async () => {
    const isDone = await getEncryptStorage('isDone');
    if (isDone === 0) {
      navigation.navigate('challenge_write', {id});
    } else {
      Alert.alert(
        '오늘 인증 완료',
        '해당 챌린지 인증을 하셨어요! 내일 다시 해주세요!',
      );
    }
  };

  const handleExit = async () => {
    await postOutChallenge(id);
    navigation.goBack();
  };
  const handleJoin = async () => {
    await postJoinChallenge(id);
    setIsType('myChallenge');
  };
  const getFeeds = async () => {
    const data = await getFeed(id);
    setFeeds(data);
  };

  useFocusEffect(
    React.useCallback(() => {
      getFeeds();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={[
          styles.text,
          {fontFamily: 'Pretendard-Bold', color: colors.BLACK},
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.text,
          {fontFamily: 'Pretendard-Regular', color: colors.DARK_GRAY},
        ]}>
        다른 사람들과 함께 루틴을 지켜봐요!
      </Text>
      {isType === 'myChallenge' ? (
        <FeedNav onPress={handleWrite} onExit={handleExit} />
      ) : (
        <FeedJoinNav onJoin={handleJoin} />
      )}
      <ScrollView style={styles.FeedList} showsVerticalScrollIndicator={false}>
        {feeds.length !== 0 ? (
          feeds.map((data, index) => (
            <FeedItem
              key={index}
              feedId={data.feedId}
              feedUserName={data.feedUserName}
              content={data.content}
              feedRegDate={data.feedRegDate}
              uri={data.feedImg}
              like={data.like}
              isLiked={data.isLiked}
            />
          ))
        ) : (
          <View style={styles.nullList}>
            <CustomText label="인증 피드가 존재하지 않아요" size={18} />
            <CustomText
              label="다른 사람들보다 먼저 인증피드를 올려보세요!"
              size={18}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
  },
  FeedList: {
    flex: 1,
  },
  nullList: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChallengeFeedPage;
